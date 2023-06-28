import React from 'react';

import DropZone from './DragZone';

import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import GRID_ITEMS from "./GridItems/GridItems.tsx";
import DraggableItem from "./DraggableItem.tsx";
import GridItem from "./GridItems/GridItem.tsx";

const GridDashboard: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };

    function getAllGridItemsForSidebar(onDrag: () => void){
        return GRID_ITEMS.map((item: GridItem, key: number ) =>
            <DraggableItem key={key} name={item.state.name} onDrag={onDrag}>
                {item.render()}
            </DraggableItem>
        );
    }

    return (
        <div>
            <div className={""}>
                {isOpen &&
                    <div className={"h-full w-full fixed bg-gray-500 z-20 opacity-40"} onClick={closeSidebar}></div>
                }
                <button
                    className="fixed z-10 left-[1rem] bottom-[1rem] middle none center rounded-lg bg-pink-500 p-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    data-ripple-light="true"
                    onClick={toggleSidebar}
                >
                    <AddIcon/>
                </button>
                <div className={"content w-screen h-screen"}>
                    <h1>Grid Dashboard</h1>
                    <div className={"dropzone-container h-full"}>
                        <DropZone />
                    </div>
                </div>
            </div>
            <div className={`z-30 fixed  top-0 left-0 ${isOpen ? '' : 'translate-x-[-100%]'}`}>
                <div className="bg-gray-200 w-64">
                    <CloseIcon className={"absolute right-0"} onClick={toggleSidebar}/>
                    <div className="p-4 flex justify-between">
                        <h1 className="text-lg font-semibold">Drag What You Want &gt;&gt;</h1>
                    </div>
                    <div className="p-4">
                        <ul>
                            {getAllGridItemsForSidebar(closeSidebar)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GridDashboard;