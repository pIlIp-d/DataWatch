import SimpleGridItem from "./SimpleGridItem.tsx";
import GridItem from "./GridItem.tsx";


const GRID_ITEMS: GridItem[] = [
    new SimpleGridItem({name:"aa"}),
    new SimpleGridItem({name:"bb"}),
    new SimpleGridItem({name:"cc"}),
    new SimpleGridItem({name:"dd"})
];

export function getGridItemNodeByName(name: string){
    return GRID_ITEMS.filter(i => i.state.name === name)[0].clone();
}

export default GRID_ITEMS;
export const GRID_ITEM_LENGTH = GRID_ITEMS.length;