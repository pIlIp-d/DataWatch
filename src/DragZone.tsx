import {useEffect, useState} from "react";
import {DragOverEvent, Layout, Layouts, Responsive, WidthProvider} from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import {getGridItemNodeByName} from "./GridItems/GridItems.tsx";
import GridItem from "./GridItems/GridItem.tsx";
import CloseIcon from "@mui/icons-material/Close";

const ReactGridLayout = WidthProvider(Responsive);

type CustomLayout = Layout & { name?: string };

type ItemType = {
    gridItem: GridItem;
    layout: CustomLayout;
}

const DropZone = () => {
    const breakpoints = {lg: 3000, md: 2000, sm: 1700, xs: 1000, xxs: 800};
    const cols = {lg: 8, md: 6, sm: 5, xs: 4, xxs: 2};
    const [currentBreakpoint, setCurrentBreakpoint] = useState<"lg" | "md" | "sm" | "xs" | "xxs">("lg");

    const [children, setChildren] = useState<ItemType[]>(() => {
        const storedState = localStorage.getItem("layout");
        if (storedState) {
            const layout = JSON.parse(storedState);
            return layout.map((l: Layout & { name: string }) => {
                return {layout: l, gridItem: getGridItemNodeByName(l.name)}
            });
        } else return [];
    });
    const addChild = (newChild: ItemType) => {
        setChildren((c) => [...c, newChild]);
    };
    const removeItem = (id: string) => {
        setChildren((c) => c.filter(i => i.gridItem.state.id !== id));
    }

    useEffect(() => {
        const layout = JSON.stringify(children.map(child => {
            return {...child.layout, name: child.gridItem.state.name}
        }));
        localStorage.setItem("layout", layout);
    }, [children]);


    function setLayout(newLayout: CustomLayout[]) {
        /**
         * wierd i mapping is used because react grid layout has a bug where i is inconsistent and therefore needs to be manually mapped
         */
        setChildren(oldChildren => oldChildren.map((child, index) => {
            const layout = newLayout.find(layout => layout.i === "" + index);
            if (layout)
                return {layout: {...layout, i: child.gridItem.state.id}, gridItem: child.gridItem};
            else
                return child;
        }))
    }

    function onDrop(layouts: Layout[], layout: Layout, e: DragEvent): void {
        if (e.dataTransfer) {
            const data = e.dataTransfer.getData("text/plain");
            const newElement = getGridItemNodeByName(data);
            addChild({gridItem: newElement, layout: {...layout, resizeHandles: ["se"], name: data}});
        }
    }

    function onDropDragOver(e: DragOverEvent): { w?: number, h?: number } | false | undefined {
        function getNearestWidth(absWidth: number | undefined): number {
            if (!absWidth) return 4;

            let result = 0;
            const colWidth = breakpoints[currentBreakpoint] / cols[currentBreakpoint];
            while (absWidth > result) {
                result += colWidth;
            }
            return Math.floor(result / colWidth);
        }

        if ("dataTransfer" in e) {
            const transferredData = e.dataTransfer.getData("text/plain");
            const elementWidth = document.getElementById(transferredData)?.offsetWidth;
            return {w: getNearestWidth(elementWidth), h: 1};
        }
    }

    function renderItems() {
        return children.map((child, index) =>
            <div key={index} className={"h-full w-full bg-background rounded-l p-1"} data-grid={child.layout as Layout}>
                <CloseIcon className={"absolute right-0"} onClick={() => removeItem(child.gridItem.state.id)}/>
                {child.gridItem.render()}
            </div>
        );
    }

    const layouts: Layouts = {};
    layouts[currentBreakpoint] = children.map(l => l.layout as Layout);
    return (
        <div className="layout w-full h-full overflow-x-hidden">
            <ReactGridLayout
                className="layout w-full min-h-full"
                breakpoints={breakpoints}
                cols={cols}
                rowHeight={120}
                onLayoutChange={setLayout}
                onResize={setLayout}
                layouts={layouts}
                onBreakpointChange={(newBreakpoint: "lg" | "md" | "sm" | "xs" | "xxs") => setCurrentBreakpoint(newBreakpoint)}
                containerPadding={[10, 10]}
                isResizable={true}
                isDraggable={true}
                isDroppable={true}
                margin={[10, 10]}
                onDropDragOver={onDropDragOver}
                onDrop={onDrop}
                verticalCompact={true}
                draggableCancel=".cancel-drag"
            >
                {renderItems()}
            </ReactGridLayout>
        </div>
    );
};

export default DropZone;