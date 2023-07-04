import GridItem from "./GridItem.tsx";
import {ReactElement} from "react";

export default class SimpleGridItem extends GridItem{
    generateDOM(): ReactElement | null {
        return <>{this.state.name}</>;
    }
}