// Libraries
import React from 'react';

import SelectedPrsDetailMenu from './SelectedPrsDetailMenu.jsx';
import SelectedPrsWithGroupDetailsMenu from './SelectedPrsWithGroupDetailsMenu.jsx';

function Header(props) {
    let selectedItemIds = props.selectedItemIds ?? [];

    let { selectedPrIds, selectedGroupIds } = selectedItemIds.reduce((acc, itemId) => {
        if (props.structure.includes(itemId)) {
            acc.selectedPrIds.push(itemId)
        } else {
            acc.selectedGroupIds.push(itemId)
        }
        return acc
    }, {selectedPrIds: [], selectedGroupIds: []}) 

    let isSelectionOnlyRootPrs = selectedPrIds.length >= 2 && selectedGroupIds.length == 0
    let isSelectionSingleGroup = selectedPrIds.length >= 1 && selectedGroupIds.length == 1

    return <div className='header'>
        <div className='main-header'>
            <span className="header-text">PULLS</span>
            <div>
                {
                    isSelectionOnlyRootPrs &&
                    <SelectedPrsDetailMenu 
                        onGroupClick={props.onGroupSelectedPrs}
                        onOpenClick={props.onOpenSelectedPrs}
                        onCopyClick={props.onCopySelectedPrs} />
                }
                {
                    isSelectionSingleGroup &&
                    <SelectedPrsWithGroupDetailsMenu 
                        onAddToGroupClick={props.onAddToSelectedGroup} />
                }
            </div>
        </div>
    </div>
}

export default Header;