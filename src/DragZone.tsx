import {useEffect, useState} from "react";
import {DragOverEvent, Layout, Layouts, Responsive, WidthProvider} from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import {getGridItemNodeByName, InstancedGridItem} from "./GridItems/GridItems.tsx";
import CloseIcon from "@mui/icons-material/Close";

const ReactGridLayout = WidthProvider(Responsive);

type CustomLayout = Layout & { name?: string };

type ItemType = {
    item: InstancedGridItem;
    layout: CustomLayout;
}

const DropZone = () => {
    const breakpoints = {lg: 3000, md: 2000, sm: 1700, xs: 1000, xxs: 800};
    const cols = {lg: 8, md: 6, sm: 5, xs: 4, xxs: 2};

    const ROW_HEIGHT = 120;

    function getCurrentBreakpoint() {
        const screen_width = window.innerWidth
        let newBreakPoint: "lg" | "md" | "sm" | "xs" | "xxs";
        if (screen_width >= breakpoints.lg) {
            newBreakPoint = 'lg';
        } else if (screen_width >= breakpoints.md) {
            newBreakPoint = 'md';
        } else if (screen_width >= breakpoints.sm) {
            newBreakPoint = 'sm';
        } else if (screen_width >= breakpoints.xs) {
            newBreakPoint = 'xs';
        } else {
            newBreakPoint = 'xxs';
        }
        return newBreakPoint;
    }

    const [currentBreakpoint, setCurrentBreakpoint] = useState<"lg" | "md" | "sm" | "xs" | "xxs">(getCurrentBreakpoint());

    const [children, setChildren] = useState<ItemType[]>(() => {
        const storedState = localStorage.getItem("layout");
        if (storedState) {
            const layout = JSON.parse(storedState);
            return layout.map((l: Layout & { name: string }) => {
                const item = getGridItemNodeByName(l.name);
                return {layout: {...l, i: item.id}, item: item};
            });
        } else return [];
    });

    const addChild = (newChild: ItemType) => {
        setChildren((c) => [...c, newChild]);
    };
    const removeItem = (child: ItemType) => {
        setChildren((c) => c.filter((item) => item !== child));
    }

    useEffect(() => {
        const layout = JSON.stringify(children.map(child => {
            return {...child.layout, name: child.item.props.name}
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
                return {...child, layout: {...layout, i: child.item.id}};
            else
                return child;
        }))
    }

    function onDrop(_: Layout[], layout: Layout, e: DragEvent): void {
        if (e.dataTransfer) {
            const data = e.dataTransfer.getData("text/plain");
            const newElement = getGridItemNodeByName(data);
            addChild({item: newElement, layout: {...layout, resizeHandles: ["se"], name: data}});
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

        function getNearestHeight(absHeight: number | undefined): number {
            if (!absHeight) return 1;
            let result = 0;
            while (absHeight > result) {
                result += ROW_HEIGHT;
            }
            return Math.floor(result / ROW_HEIGHT);
        }

        if ("dataTransfer" in e) {
            const transferredData = e.dataTransfer.getData("text/plain");
            const elementWidth = document.getElementById(transferredData)?.offsetWidth;
            const elementHeight = document.getElementById(transferredData)?.offsetHeight;
            return {w: getNearestWidth(elementWidth), h: getNearestHeight(elementHeight)};
        }
    }

    const layouts: Layouts = {};
    layouts[currentBreakpoint] = children.map(l => l.layout as Layout);
    return (
        <ReactGridLayout
            className="layout w-full min-h-full overflow-x-hidden"
            breakpoints={breakpoints}
            breakpoint={currentBreakpoint}
            layouts={layouts}
            cols={cols}
            rowHeight={ROW_HEIGHT}
            onLayoutChange={(a) => setLayout(a)}
            onResize={setLayout}
            onWidthChange={() => setCurrentBreakpoint(getCurrentBreakpoint())}
            isResizable={true}
            isDraggable={true}
            isDroppable={true}
            onDropDragOver={onDropDragOver}
            onDrop={onDrop}
            verticalCompact={true}
            draggableCancel=".cancel-drag"
        >
            {children.map((child, index) =>
                <div key={index} className={"h-full w-full bg-background rounded-l p-1"} data-grid={child.layout as Layout}>
                    <CloseIcon className={"absolute right-0"} onClick={() => removeItem(child)}/>
                    {child.item.instance}
                </div>
            )}
        </ReactGridLayout>
    );
};

export default DropZone;