import React, { useState, useRef } from "react";

import {useDispatch, useSelector} from 'react-redux';

import {renameGroup, deleteGroup, move} from '../redux/structure_slice';

import PrListItemGroupMenuItem from "./PrListItemGroupDetailsMenu.jsx";

import useSortableItem from "../hooks/useSortableItem.js";

function PrListItemGroup({
  name,
  id,
  index,
  children,
}) {
  let dispatch = useDispatch();
  let isSelected = useSelector(state => state.selectedItemIds.includes(id))

  let [isOpen, setIsOpen] = useState(false);

  let { ref, isDragging, className } = useSortableItem({
    id,
    index,
    allowMiddleHover: false,
    allowBelowHover: false,
    onDrop: (item, hoverState, newIndex) => {
      if (hoverState == "above") {
        dispatch(move(item.id, newIndex)); // intentionally pass no group ids
      } else if (hoverState == "below") {
        dispatch(move(item.id, newIndex + 1));
      }
    },
  });


  if ((children?.length ?? 0) <= 0) return null;

  return (
    <div
      key={name}
      ref={ref}
      style={{ visibility: isDragging ? "hidden" : "visible" }}
      className={`pr-list-item-group ${className}`}
    >
      <div
        className={`pr-list-item-group__label ${isSelected ? "selected" : ""}`}
        onClick={(e) => {
          if (e?.metaKey || e?.shiftKey) {
            dispatch(toggleItemSelection(id));
          } else {
            setIsOpen(!isOpen);
          }
        }}
      >
        <div>
          {isOpen && <i className="fas fa-chevron-down"></i>}

          {!isOpen && <i className="fas fa-chevron-right"></i>}

          {name}
        </div>

        <div className="pr-list-item__button-group">
          <PrListItemGroupMenuItem
            onUngroupClick={() => dispatch(deleteGroup(id))}
            onRenameClick={() => dispatch(renameGroup(id))}
          />
        </div>
      </div>

      {isOpen && <div className="pr-list-item-group__body">{children}</div>}
    </div>
  );
}

export default PrListItemGroup;
