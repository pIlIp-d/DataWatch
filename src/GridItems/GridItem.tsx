import {Component, ReactElement} from "react";

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
        return <div className={"grid-item"}>
            {this.generateDOM()}
        </div>;
    }
}
