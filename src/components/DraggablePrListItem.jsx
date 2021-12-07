import React, { useRef, useState } from 'react';

import PrListItem from './PrListItem.jsx';

import { useDrag, useDrop, useDragDropManager } from 'react-dnd';

function DraggablePrListItem(props) {
    const [hov, setHov] = useState(false);

    const dragDropManager = useDragDropManager()
    const ref = useRef();
    const [{isHovered, isAbove, isBelow}, drop] = useDrop({
        accept: 'pr',
        drop(item) {
            props.onMove(item.id, props.index)
            // props.onGroupPrs([item.id, props.id])
        },
        canDrop(item) {
            return item.id != props.id && props.allowDrop
        },
        collect(monitor) {
            // console.log('called')
            if (ref.current != null && monitor.isOver()) {
                const vertGutterSize = 15;

                const hoverBoundingRect = ref.current?.getBoundingClientRect();
                const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
                const clientOffset = monitor.getClientOffset();
                const hoverClientY = clientOffset.y - hoverBoundingRect.top;
                
                // console.log(hoverMiddleY, hoverClientY)

                return {
                    isHovered: true,
                    isAbove: hoverClientY > hoverMiddleY,
                    isBelow: hoverClientY < hoverMiddleY
                }
            }
            return {
                isHovered: monitor.isOver(),
            }
        }
    });

    const [{isDragging, clientOffset}, drag] = useDrag({
        type: 'pr',
        item: () => ({ id: props.id, index: props.index }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            clientOffset: monitor.getClientOffset()
        }),
    });

    drag(drop(ref))

    // console.log(dragDropManager.getMonitor().getClientOffset())
    let borderStyles;
    // if (isHovered) {
    //     const hoverBoundingRect = ref.current?.getBoundingClientRect();
    //     if (isAbove) {
    //         borderStyles = {borderTop: 'solid 1px red'}
    //     } else if (isBelow) {
    //         borderStyles = {borderBottom: 'solid 1px red'}
    //     }
    // }

    return <PrListItem 
        {...props}
        isHovered={isHovered}
        onMouseOver={(e) => console.log(e)}
        style={{
            opacity: isDragging ? .5 : 1,
            ...borderStyles
        }}
        ref={ref}
    />
}

export default DraggablePrListItem;