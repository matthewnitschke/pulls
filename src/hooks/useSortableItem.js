import React, {useState, useRef} from 'react';

import { useDrag, useDrop } from 'react-dnd';

function useSortableItem(props) {
    const ref = useRef();
    const [ hoverState, setHoverState ] = useState()

    const [{ isHovered }, drop] = useDrop({
        accept: 'pr',
        hover(_, monitor) {

            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const clientOffset = monitor.getClientOffset();

            if (hoverBoundingRect == null || clientOffset == null) return {};

            const moveBoundSize = 15;
            const upperBound = hoverBoundingRect.top+moveBoundSize
            const lowerBound = hoverBoundingRect.bottom-moveBoundSize

            let newHoverState;
            if (clientOffset.y < upperBound) {
                // newHoverState = 'above';
                setHoverState('above');
            } else if (clientOffset.y > lowerBound && props.allowBelowHover != false) {
                // newHoverState = 'below';
                setHoverState('below');
            } else if (props.allowMiddleHover != false) {
                // newHoverState = 'middle';
                setHoverState('middle');
            }

            // if (props.canHover == null || props.canHover(item, newHoverState)) {
                // setHoverState(newHoverState)
            // }
        },
        drop(item) {
            let newIndex = props.index > item.index ? props.index-1 : props.index
            props.onDrop(item, hoverState, newIndex)
        },
        canDrop(item) { return item.id != props.id },
        collect(monitor) { return { isHovered: monitor.isOver() }}
    });

    const [{ isDragging }, drag] = useDrag({
        type: 'pr',
        item: () => ({ id: props.id, index: props.index }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref))

    let dragClass = '';
    if (isHovered) {
        if (hoverState == 'above') {
            dragClass = 'drag-above';
        } else if (hoverState == 'below') {
            dragClass = 'drag-below';
        } else if (hoverState == 'middle') {
            dragClass = 'drag-middle';
        }
    }

    return {
        ref,
        isDragging,
        isHovered,
        className: dragClass
    }
}

export default useSortableItem;