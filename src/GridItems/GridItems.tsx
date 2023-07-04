import SimpleGridItem from "./SimpleGridItem.tsx";
import GridItem, {GridItemProps} from "./GridItem.tsx";
import PlotlyGridItem from "./PlotlyGridItem.tsx";
import {ReactNode} from "react";

export type GridItemWrapper = { type: typeof GridItem, props: GridItemProps };

const GRID_ITEMS: GridItemWrapper[] = [
    {type: SimpleGridItem, props: {name: "a"}},
    {type: SimpleGridItem, props: {name: "b"}},
    {type: SimpleGridItem, props: {name: "c"}},
    {type: SimpleGridItem, props: {name: "d"}},
    {type: SimpleGridItem, props: {name: "e"}},
    {type: SimpleGridItem, props: {name: "f"}},
    {type: PlotlyGridItem, props: {name: "SimplePlot"}}
];

/*const GRID_ITEMS: GridItem[] = [
    new SimpleGridItem({name: "aa"}),
    new SimpleGridItem({name: "bb"}),
    new SimpleGridItem({name: "cc"}),
    new SimpleGridItem({name: "dd"}),
    new PlotlyGridItem({name: "SimplePlot"})
];
*/

export type InstancedGridItem = { instance: ReactNode, props: GridItemProps, id: string };

export function getComponentFromGridItem(item: GridItemWrapper, id: string) {
    const Comp = item.type;
    return <Comp key={id} {...item.props}/>;
}

function getNewRandomId() {
    return (Math.random() + 1).toString(36).substring(2);
}

export function getGridItemNodeByName(name: string) : InstancedGridItem{
    const item =  GRID_ITEMS.filter(i => i.props.name === name)[0];
    const id = getNewRandomId();
    return {id: id, instance: getComponentFromGridItem(item, id), props: item.props };
}

export default GRID_ITEMS;
