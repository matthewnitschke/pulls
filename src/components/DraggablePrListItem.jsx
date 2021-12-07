import React, { useRef } from 'react';

import PrListItem from './PrListItem.jsx';

import { useDrag, useDrop } from 'react-dnd';

function DraggablePrListItem(props) {
    const ref = useRef();
    const [{isHovered}, drop] = useDrop({
        accept: 'pr',
        drop(item) {
            props.onMove(item.id, props.index)
            // props.onGroupPrs([item.id, props.id])
        },
        hover(item, monitor) {
            // if (!ref.current) {
            //     return;
            // }
            // const dragIndex = item.index;
            // const hoverIndex = props.index;
            // // Don't replace items with themselves
            // if (dragIndex === hoverIndex) {
            //     return;
            // }
            // // Determine rectangle on screen
            // const hoverBoundingRect = ref.current?.getBoundingClientRect();
            // // Get vertical middle
            // const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // // Determine mouse position
            // const clientOffset = monitor.getClientOffset();
            // // Get pixels to the top
            // const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            // // Only perform the move when the mouse has crossed half of the items height
            // // When dragging downwards, only move when the cursor is below 50%
            // // When dragging upwards, only move when the cursor is above 50%
            // // Dragging downwards
            // if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            //     return;
            // }
            // // Dragging upwards
            // if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            //     return;
            // }
            // // Time to actually perform the action
            // // moveCard(dragIndex, hoverIndex);
            // console.log(`Move ${dragIndex} to ${hoverIndex}`);
            // props.onMove(item.id, hoverIndex)

            // // Note: we're mutating the monitor item here!
            // // Generally it's better to avoid mutations,
            // // but it's good here for the sake of performance
            // // to avoid expensive index searches.
            // item.index = hoverIndex;
        },
        canDrop(item) {
            return item.id != props.id && props.allowDrop
        },
        collect(monitor) {
            return {
                isHovered: monitor.isOver()
            }
        }
    });

    const [{isDragging}, drag] = useDrag({
        type: 'pr',
        item: () => ({ id: props.id, index: props.index }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref))
    return <PrListItem 
        {...props}
        isHovered={isHovered}
        style={{display: isDragging ? 'none' : ''}}
        ref={ref}
    />
}

export default DraggablePrListItem;