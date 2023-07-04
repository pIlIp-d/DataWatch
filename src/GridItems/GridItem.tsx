import {Component, ReactElement} from "react";
import {DragHandle} from "@mui/icons-material";

export  type GridItemProps = {
    name: string;
};
export type GridItemState = {
    name: string,
    data: object
};


export default class GridItem extends Component<GridItemProps, GridItemState> {

    constructor(props: GridItemProps) {
        super(props);
        this.state = {
            name: this.props.name,
            data: {}
        }
    }

    generateDOM(): ReactElement | null {
        return null;
    }

    render() {
        return <div className={"grid-item flex h-full w-full flex-col bg-background"}>
            <DragHandle className="drag-handle"/>
            <div className={"cancel-drag flex-1"}>
                {this.generateDOM()}
            </div>
        </div>;
    }
}
