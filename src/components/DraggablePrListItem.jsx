import React, { useRef } from 'react';

import PrListItem from './PrListItem.jsx';

import { useDrag, useDrop } from 'react-dnd';

function DraggablePrListItem(props) {
    const ref = useRef();
    const [{isHovered}, drop] = useDrop({
        accept: 'pr',
        drop(item) {
            props.onGroupPrs([item.id, props.id])
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
        item: () => ({ id: props.id }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref))
    return <PrListItem 
        {...props}
        isHovered={isHovered}
        style={{visibility: isDragging ? 'hidden' : 'visible'}}
        ref={ref}
    />
}

export default DraggablePrListItem;