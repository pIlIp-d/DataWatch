import GridItem, {GridItemProps} from "./GridItem.tsx";
import {ReactElement} from "react";
import WordCloud from 'react-d3-cloud';

type WordWeight = {
    text: string;
    value: number;
}

type AdditionalState = {
    currentTab: "Tags";
    values: {
        tab: "Tags", values: { text: string, value: number }[]
    }[];
}

export default class WordCloudGridItem extends GridItem<object, AdditionalState> {

    constructor(props: GridItemProps) {
        super(props);
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        fetch('data/instagram/your_topics/your_topics.json')
            .then((response) => response.json())
            .then(json => {
                console.log(json);
                const raw_data = json["topics_your_topics"].map((v) => v["string_map_data"]["Name"]["value"]);

                console.log(createWordCloud(raw_data));
                this.setState({
                    ...this.state,
                    currentTab: "Tags",
                    values: [
                        {tab: "Tags", values: createWordCloud(raw_data)}
                    ]
                })
            });
    }

    _setCurrentTab(newTab: string) {
        this.setState((s) => {
            return {...s, currentTab: newTab}
        });
    }

    generateDOM(dimensions: { width: number, height: number }): ReactElement | null {
        const {currentTab, values} = this.state;
        let data: { text: string, value: number }[] = [];
        if (values)
            data = values.filter((i: {
                tab: "Tags", values: { text: string, value: number }[]
            }) => i.tab === currentTab)[0].values;

        return <div className={"w-full h-0 pb-[100%]"}>
            <div className={"grid pt-5"} style={{height: `calc(${dimensions.height}px - 2.5rem)`}}>
                {this.state.data &&
                    <WordCloud
                        height={dimensions.height}
                        width={dimensions.width}
                        data={data}
                        spiral={'rectangular'}
                        fontSize={30}
                        rotate={() => {
                            const minAngle = -60;
                            const maxAngle = 60;
                            return Math.random() * (maxAngle - minAngle) + minAngle;
                        }}
                    />
                }
            </div>
        </div>;
    }
}


function createWordCloud(tags: string[]): WordWeight[] {
    const wordCounts: { [word: string]: number } = {};

    // Process tags
    for (let tag of tags) {
        // Convert to lowercase
        //tag = tag.toLowerCase();
        // Remove punctuation (if needed)
        //tag = tag.replace(/[.,/#!$%^&*;:{}=\-_`~()]|'s/g, '');
        // Stem the word
        //tag = stemmer(tag);

        // Filter out short words
        if (tag.length > 2) {
            // Increment the count of the word
            wordCounts[tag] = (wordCounts[tag] || 0) + 1;
        }
    }

    // Convert wordCounts to WordWeight objects
    return Object.entries(wordCounts).map(([word, count]) => ({
        text: word,
        value: count,
    }));

}
