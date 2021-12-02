// Libraries
import React, { useState } from 'react';
import { openUrl } from '../utils.js';

// Components
import PrListItem from './PrListItem.jsx';
import PrListItemGroup from './PrListItemGroup.jsx';
import FilterInput from './FilterInput.jsx';

function PrList(props) {
    let [ filterText, setFilterText ] = useState('')

    function _handleSelectItem(prId) {
        if (props.selectedItemIds.includes(prId)) {
            props.setSelectedItemIds(
                props.selectedItemIds.filter(selPrId => selPrId != prId)
            );
        } else {
            props.setSelectedItemIds([...props.selectedItemIds, prId]);
        }
    }

    function _handleClick(e, prId) {
        if (e?.metaKey || e?.shiftKey) {
            _handleSelectItem(prId)
        } else {
            openUrl(props.prs[prId].prUrl);
        }
    }

    function _handleFilterInputKeyDown(e) {
        if (e.key == 'Escape') {
            props.onHideWindow()
        }
    }

    function __matchesFilterText(prName) {
        if (filterText == null || filterText == "") return true;
        return prName.toLowerCase().indexOf(filterText.toLowerCase()) >= 0;
    }

    function __renderPrListItem(pr) {
        if (!__matchesFilterText(pr.name)) return null;

        return <PrListItem
            key={pr.id}
            isSelected={props.selectedItemIds.includes(pr.id)}
            name={pr.name}
            repo={pr.repo}
            isClosed={pr.prState == 'closed'}
            prStatus={pr.prStatus}
            onClick={(e) => _handleClick(e, pr.id)} />;
    }

    return <>
         <FilterInput
            value={filterText}
            onChange={setFilterText}
            onKeyDown={_handleFilterInputKeyDown} />
        
        { Object.keys(props.prs).length > 0 &&        
            <div className="pr-list" role="list">
                {
                    props.structure.map((data) => {
                        if (typeof data === 'string') {
                            return __renderPrListItem(props.prs[data])
                        }

                        return <PrListItemGroup 
                            key={data.id}
                            name={data.name}
                            isSelected={props.selectedItemIds.includes(data.id)}
                            onEditName={() => props.onEditGroupName(data.id)}
                            onDelete={() => props.onDeleteGroup(data.id)}
                            onMove={(delta) => props.onMoveGroup(data.id, delta)}
                            onSelect={() => _handleSelectItem(data.id)}
                        >
                            {data.prIds
                                .map(prId => __renderPrListItem(props.prs[prId]))
                                .filter(pr => pr !== null)
                            }
                        </PrListItemGroup>
                    })
                }
            </div>
        }
    </>
}

export default PrList;