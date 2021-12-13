import React, { useRef, useState } from 'react';

import PrListItem from './PrListItem.jsx';

import { useDrag, useDrop, useDragDropManager } from 'react-dnd';
import useSortableItem from '../hooks/useSortableItem.js';

function DraggablePrListItem(props) {
    const {ref, isHovered, isDragging, className} = useSortableItem({
        id: props.id, 
        index: props.index,
        onDrop: (item, hoverState, newIndex) => {
            if (hoverState == 'above') {
                props.onMove(item.id, newIndex, props.groupId)
            } else if (hoverState == 'below') {
                props.onMove(item.id, newIndex+1, props.groupId)
            } else {
                props.onGroupPrs([item.id, props.id])
            }
        },
    });

    return <PrListItem 
        {...props}
        isHovered={isHovered}
        style={{ visibility: isDragging ? 'hidden' : 'visible' }}
        className={className}
        ref={ref}
    />
}

export default DraggablePrListItem;