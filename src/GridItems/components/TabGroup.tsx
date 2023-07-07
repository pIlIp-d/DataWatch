import {Component} from "react";

type TabGroupProps = { tabs: string[], currentTab?: string, setCurrentTab: (tab: string) => void };
type TabGroupState = never;

export default class TabGroup extends Component<TabGroupProps, TabGroupState> {
    constructor(props: TabGroupProps) {
        super(props);
    }

    render() {
        return <div className={"absolute mx-auto w-full flex justify-center pb-1"}>
            <ul className="flex justify-between bg-divider rounded-md relative" role="list">
                {this.props.tabs.map((tab: string, key: number) => {
                    return <li
                        key={key}
                        onClick={() => this.props.setCurrentTab(tab)}
                        className={`p-1 rounded-sm text-center text-sm cursor-pointer active:bg-divider hover:bg-divider ${this.props.currentTab == tab ? 'bg-divider' : 'bg-background'}`}
                    >
                        <span className="ml-1">{tab}</span>
                    </li>
                })}
            </ul>
        </div>;
    }
}