import GridItem from "./GridItem.tsx";
import {ReactElement} from "react";

export default class SimpleGridItem extends GridItem{
    clone(): GridItem {
        return new SimpleGridItem(this.props);
    }

    generateDOM(): ReactElement | null {
        return <>{this.state.name}</>;
    }
}