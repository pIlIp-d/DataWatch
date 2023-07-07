import GridItem, {GridItemProps} from "./GridItem.tsx";
import {ReactElement} from "react";
import {ResponsiveCirclePacking} from "@nivo/circle-packing";
import TabGroup from "./components/TabGroup.tsx";

type AdditionalState = {
    currentTab: "City" | "Country";
    values: {
        tab: "City" | "Country", values: { name: string, percentage: number }[]
    }[];
}

export default class AudienceLocationGridItem extends GridItem<object, AdditionalState> {

    constructor(props: GridItemProps) {
        super(props);
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        fetch('data/instagram/past_instagram_insights/audience_insights.json')
            .then((response) => response.json())
            .then(json => {
                const raw_data = json["organic_insights_audience"][0]["string_map_data"];

                function decode_utf8(text: string) {
                    return decodeURIComponent(escape(text));
                }

                function getCities(raw_data: string) {
                    return raw_data.split(',').map(item => {
                        const [city, percentage] = item.trim().split(':');
                        return {name: decode_utf8(city.trim()), percentage: parseFloat(percentage.trim())};
                    });
                }

                this.setState({
                    ...this.state,
                    currentTab: "City",
                    values: [
                        {tab: "City", values: getCities(raw_data["Follower Percentage by City"]["value"])},
                        {tab: "Country", values: getCities(raw_data["Follower Percentage by Country"]["value"])}
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
        let data: { name: string, percentage: number }[] = [];
        if (values)
            data = values.filter((i: {
                tab: "City" | "Country", values: { name: string, percentage: number }[]
            }) => i.tab === currentTab)[0].values;

        console.log("changed");
        return <div className={"w-full h-0 pb-[100%]"}>
            <TabGroup tabs={["City", "Country"]} currentTab={currentTab}
                      setCurrentTab={(newTab: string) => this._setCurrentTab(newTab)}/>
            <div className={"grid pt-5"} style={{height: `calc(${dimensions.height}px - 2.5rem)`}}>
                {data && <ResponsiveCirclePacking
                    data={{"name": "root", "children": data}}
                    id="name"
                    width={dimensions.width-5}
                    height={dimensions.height-5}
                    value="percentage"
                    padding={10}
                    colorBy="id"
                    enableLabels={true}
                    labelsFilter={n => {
                        const text = String(n.label);
                        // Memoize the label dimensions using a memoization cache
                        const {width, height} = getWidthOfText(text, 12);
                        return width <= n.node.radius * 2 && height <= n.node.radius * 2;
                    }}
                    labelsSkipRadius={25}
                    labelTextColor={{from: 'color', modifiers: [['darker', 10]]}}
                    colors={{scheme: 'set3'}}
                    leavesOnly={true}
                    tooltip={n => {
                        return n.data.name != "root" &&
                            <div>
                                <div className={"rounded-md text-divider bg-text_secondary p-2 border-none relative"}
                                     style={{zIndex: "100!important"}}>
                                    <div className={`my-auto absolute rounded-sm w-5 h-5`}
                                         style={{background: n.color}}/>
                                    <span className={"my-auto ml-7"}>{n.data.name}: {n.data.percentage}%</span>
                                </div>
                            </div>;
                    }}
                >
                </ResponsiveCirclePacking>}
            </div>
        </div>;
    }
}

function getWidthOfText(text: string, fontSize: number) {
    function measureElement(element: Element) {
        const rect = element.getBoundingClientRect();
        return {width: rect.width, height: rect.height};
    }

    // Create a virtual container element for measuring text dimensions
    const containerElement = document.createElement("div");
    containerElement.style.position = "absolute";
    containerElement.style.visibility = "hidden";
    containerElement.style.fontSize = `${fontSize}px`;
    containerElement.innerHTML = text;
    document.body.appendChild(containerElement);
    const dim =  measureElement(containerElement);
    document.body.removeChild(containerElement);
    return dim;
}

//apexcharts.com
// https://nivo.rocks/calendar/