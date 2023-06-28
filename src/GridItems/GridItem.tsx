import {Component, ReactElement} from "react";
import {DragHandle} from "@mui/icons-material";

type GridItemProps = {
    name: string;
};
type GridItemState = {
    name: string,
    id: string
};
function getNewRandomId(){
    return (Math.random() + 1).toString(36).substring(2);
}

export default abstract class GridItem extends Component<GridItemProps, GridItemState> {

    constructor(props: Readonly<GridItemProps>) {
        super(props);
        this.state = {
             name: this.props.name, id: getNewRandomId()
        };
    }

    abstract generateDOM(): ReactElement | null;

    abstract clone(): GridItem;

    render() {
        return <div className={"grid-item flex h-full w-full flex-col"}>
            <DragHandle className="drag-handle" />
            <div className={"cancel-drag flex-1 bg-green-800"}>
                {this.generateDOM()}
            </div>
        </div>;
    }
}
