// Libraries
import React, { useState } from 'react';
import { openUrl } from '../utils.js';

// Components
import PrListItemGroup from './PrListItemGroup.jsx';
import FilterInput from './FilterInput.jsx';
import DraggablePrListItem from './DraggablePrListItem.jsx';

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

    function __renderPrListItem(pr, index, groupId) {
        if (pr == null) return null;

        if (!__matchesFilterText(pr.name)) return null;

        return <DraggablePrListItem
            key={pr.id}
            index={index}
            id={pr.id}
            index={index}
            groupId={groupId}
            isSelected={props.selectedItemIds.includes(pr.id)}
            onMove={(id, index, groupId) => props.onMove(id, index, groupId)}
            filterText={filterText}
            name={pr.name}
            repo={pr.repo}
            onGroupPrs={props.onGroupPrs}
            isClosed={pr.prState == 'closed'}
            prStatus={pr.prStatus}
            prStatusContexts={pr.prStatusContexts}
            onMove={props.onMove}
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
                    props.structure
                        .map((data, i) => {
                        if (typeof data === 'string') {
                            return __renderPrListItem(props.prs[data], i)
                        }

                        return <PrListItemGroup 
                            key={data.id}
                            id={data.id}
                            index={i}
                            name={data.name}
                            isSelected={props.selectedItemIds.includes(data.id)}
                            onEditName={() => props.onEditGroupName(data.id)}
                            onDelete={() => props.onDeleteGroup(data.id)}
                            onAddPrToGroup={(prId) => props.onAddPrsToGroup([prId], data.id)}
                            onMove={props.onMove}
                            onSelect={() => _handleSelectItem(data.id)}
                        >
                            {data.prIds
                                .map((prId, gId) => __renderPrListItem(props.prs[prId], gId, data.id))
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