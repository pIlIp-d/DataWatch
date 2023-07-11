import GridItem, {GridItemProps} from "./GridItem.tsx";
import {ReactElement} from "react";
import ReactApexChart from "react-apexcharts";
import TabGroup from "./components/TabGroup.tsx";


type AdditionalState = {
    currentTab: string;
    values: { tab: "All" | "Woman" | "Men", values: { labels: string[], values: number[] } }[]
};

export default class DemographicsPlot extends GridItem<object, AdditionalState> {

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
                const data = {
                    all: raw_data["Follower Percentage by Age for All Genders"]["value"],
                    men: raw_data["Follower Percentage by Age for Men"]["value"],
                    woman: raw_data["Follower Percentage by Age for Women"]["value"]
                }

                function getDataFromString(rawString: string): { labels: string[], values: number[] } {
                    const labels = [];
                    const values = [];
                    for (const block of rawString.split(",")) {
                        labels.push(block.split(":")[0]);
                        const numWithPercentage = block.split(":")[1];
                        values.push(parseFloat(numWithPercentage.substring(0, numWithPercentage.length - 1)));
                    }
                    return {labels: labels, values: values};
                }

                this.setState({
                    currentTab: "All", values: [
                        {tab: "All", values: getDataFromString(data.all)},
                        {tab: "Woman", values: getDataFromString(data.woman)},
                        {tab: "Men", values: getDataFromString(data.men)},
                    ]
                });
            });
    }

    _setCurrentTab(newTab: string) {
        this.setState((s) => {
            return {...s, currentTab: newTab}
        });
    }

    generateDOM(dimensions: { width: number, height: number }): ReactElement | null {
        const {values, currentTab} = this.state;

        let data: { labels: string[], values: number[] } = {labels: [], values: []};
        if (values)
            data = values.filter((i: {
                tab: string,
                values: { labels: string[], values: number[] }
            }) => i.tab === currentTab)[0].values;

        return <div className={"h-full"}>
            <ReactApexChart
                options={{
                    chart: {
                        type: 'donut',
                    },
                    dataLabels: {
                        enabled: false
                    },
                    fill: {
                        type: 'gradient',
                    },
                    labels: data.labels,
                    title: {
                        text: 'Audience demographics'
                    },
                    legend: {
                        show: dimensions.width > 250,
                    },
                    tooltip: {
                        y: {formatter: (value) => value + ' %'},
                    },
                }}
                series={data.values}
                type="donut"
                width="100%"
                height="100%"
            />
            <TabGroup tabs={["All", "Woman", "Men"]} currentTab={currentTab} setCurrentTab={this._setCurrentTab.bind(this)}/>
        </div>


    }
}
