import React from 'react';

import PrListItem from './PrListItem.jsx';

import useSortableItem from '../hooks/useSortableItem.js';

import { groupPrs, move } from '../redux/structure_slice';
import { useDispatch } from 'react-redux';

function DraggablePrListItem(props) {
  const dispatch = useDispatch();

  const { ref, isHovered, isDragging, className } = useSortableItem({
    id: props.id,
    index: props.index,
    onDrop: (item, hoverState, newIndex) => {
      if (hoverState == 'above') {
        dispatch(move(item.id, newIndex, props.groupId));
      } else if (hoverState == 'below') {
        dispatch(move(item.id, newIndex + 1, props.groupId));
      } else {
        dispatch(groupPrs([item.id, props.id], 'newGroup'));
      }
    },
  });

  return (
    <PrListItem
      {...props}
      isHovered={isHovered}
      style={{ visibility: isDragging ? 'hidden' : 'visible' }}
      className={className}
      ref={ref}
    />
  );
}

export default DraggablePrListItem;
