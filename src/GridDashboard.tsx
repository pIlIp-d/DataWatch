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
        <div className={"bg-divider text-text_primary disabled:text-text_secondary"}>
            <div>
                {isOpen &&
                    <div className={"h-full w-full fixed bg-gray-500 z-20 opacity-40"} onClick={closeSidebar}></div>
                }
                <button
                    className="fixed z-10 left-[1rem]  bottom-[1rem] middle none center rounded-lg hover:bg-button_active p-3 text-button_active hover:text-text_secondary transition-all focus:opacity-[0.85]"
                    data-ripple-light="true"
                    onClick={toggleSidebar}
                >
                    <AddIcon style={{"fontSize": "4rem"}} />
                </button>
                <div className={"content w-screen h-screen"}>
                    <h1>DataWatch</h1>
                    <div className={"dropzone-container h-full"}>
                        <DropZone />
                    </div>
                </div>
            </div>
            <div className={`z-30 fixed top-0 left-0 ${isOpen ? '' : 'translate-x-[-100%]'}`}>
                <div className="bg-gray-200 w-64 ">
                    <CloseIcon className={"absolute right-0"} onClick={toggleSidebar}/>
                    <div className="p-4 flex justify-between  bg-divider">
                        <h1 className="text-lg font-semibold">Drag What You Want &gt;&gt;</h1>
                    </div>
                    <div className="p-4 bg-divider ">
                        {getAllGridItemsForSidebar(closeSidebar)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GridDashboard;