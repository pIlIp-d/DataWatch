import React, {ReactNode} from 'react';

export interface DraggableItemProps {
    name: string;
    onDrag: ()=>void;
    children: ReactNode
}

const DraggableItem: React.FC<DraggableItemProps> = ({ name, onDrag, children }) => {
    return (
      <div
          id={name}
          className="droppable-element overflow-hidden w-full border-solid border-black"
          draggable={true}
          unselectable="on"
          onDragStart={e => e.dataTransfer.setData("text/plain", name)}
          onDrag={onDrag}
        >
          {children}
        </div>
    );
};

export default DraggableItem;