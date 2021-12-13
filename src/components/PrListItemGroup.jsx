import React, {useState, useRef} from 'react';

import PrListItemGroupMenuItem from './PrListItemGroupDetailsMenu.jsx';

import useSortableItem from '../hooks/useSortableItem.js';

function PrListItemGroup({ 
    name,
    id,
    index,
    isSelected,
    onEditName,
    onDelete,
    onAddPrToGroup,
    onSelect,
    onMove,
    children
}) {
    let [ isOpen, setIsOpen ] = useState(false);

    let { ref, isDragging, className } = useSortableItem({
        id, 
        index,
        onDrop: (item, hoverState, newIndex) => {
            if (hoverState == 'above') {
                onMove(item.id, newIndex) // intentionally pass no group ids
            } else if (hoverState == 'below') {
                onMove(item.id, newIndex+1);
            } else {
                onAddPrToGroup([item.id, id]); 
            }
        },
        canHover: (_, hoverState) => {
            if (hoverState == 'middle') return false;

            if (hoverState == 'below') return false;

            return true;
        },
    })


    if ((children?.length ?? 0) <= 0) return null;

    return <div 
        key={name}
        ref={ref}
        style={{ visibility: isDragging ? 'hidden' : 'visible' }}
        className={`pr-list-item-group ${className}`}
    >
        <div 
            className={`pr-list-item-group__label ${isSelected ? 'selected' : ''}`} 
            onClick={(e) => {
                if (e?.metaKey || e?.shiftKey) {
                    onSelect()
                } else {
                    setIsOpen(!isOpen);
                }
            }}>
            <div>
                { isOpen && 
                    <i className="fas fa-chevron-down"></i>
                }

                { !isOpen && 
                    <i className="fas fa-chevron-right"></i>
                }

                {name}
            </div>
            
            <div className="pr-list-item__button-group">
                <PrListItemGroupMenuItem 
                    onUngroupClick={onDelete}
                    onRenameClick={onEditName}
                    onMoveUp={() => onMove(-1)}
                    onMoveDown={() => onMove(1)}
                    />
            </div>
        </div>

        {
            isOpen && <div className="pr-list-item-group__body">
                { children }
            </div>
        }
        
    </div>

}

export default PrListItemGroup;