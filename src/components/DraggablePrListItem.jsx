import React, { useRef, useState } from 'react';

import PrListItem from './PrListItem.jsx';

import { useDrag, useDrop, useDragDropManager } from 'react-dnd';

function DraggablePrListItem(props) {
    let [hoverState, setHoverState] = useState()

    const ref = useRef();
    const [{ isHovered }, drop] = useDrop({
        accept: 'pr',
        hover(item, monitor) {
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const clientOffset = monitor.getClientOffset();

            if (hoverBoundingRect == null || clientOffset == null) return {};

            const moveBoundSize = 15;
            const upperBound = hoverBoundingRect.top+moveBoundSize
            const lowerBound = hoverBoundingRect.bottom-moveBoundSize
            
            if (clientOffset.y < upperBound) {
                setHoverState('above')
            } else if (clientOffset.y > lowerBound) {
                setHoverState('below')
            } else {
                setHoverState('middle')
            }
        },
        drop(item) {
            let newIndex = props.index > item.index ? props.index-1 : props.index
            if (hoverState == 'above') {
                props.onMove(item.id, newIndex, props.group)
            } else if (hoverState == 'below') {
                props.onMove(item.id, newIndex+1, props.group)
            } else {
                props.onGroupPrs([item.id, props.id])
            }
        },
        canDrop(item) {
            return item.id != props.id
        },
        collect(monitor) {
            return { isHovered: monitor.isOver() }
        }
    });

    const [{ isDragging }, drag] = useDrag({
        type: 'pr',
        item: () => ({ id: props.id, index: props.index }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    let dragClass = '';
    if (isHovered) {
        if (hoverState == 'above') {
            dragClass = 'drag-above';
        } else if (hoverState == 'below') {
            dragClass = 'drag-below';
        } else {
            dragClass = 'drag-middle';
        }
    }

    drag(drop(ref))

    return <PrListItem 
        {...props}
        isHovered={isHovered}
        style={{ visibility: isDragging ? 'hidden' : 'visible' }}
        className={dragClass}
        ref={ref}
    />
}

export default DraggablePrListItem;