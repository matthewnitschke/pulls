import React, {useState} from 'react';

import PrListItemGroupMenuItem from './PrListItemGroupDetailsMenu.jsx';

function PrListItemGroup({ 
    name,
    isSelected,
    onEditName,
    onDelete,
    onSelect,
    children
}) {
    let [ isOpen, setIsOpen ] = useState(false);

    if ((children?.length ?? 0) <= 0) return null;

    return <div key={name} className="pr-list-item-group">
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