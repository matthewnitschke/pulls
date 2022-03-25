// Libraries
import React, { useState } from 'react';
import { openUrl } from '../utils.js';

import { useSelector } from 'react-redux';

// Components
import PrListItemGroup from './PrListItemGroup.jsx';
import FilterInput from './FilterInput.jsx';
import DraggablePrListItem from './DraggablePrListItem.jsx';

function PrList(props) {
    let [ filterText, setFilterText ] = useState('');

    let prs = useSelector(state => {
        let queryObj = state.queries[state.activeQueryIndex];
        return state.prs.data[queryObj.query] ?? {};
    });

    let structure = useSelector(state => {
        let queryObj = state.queries[state.activeQueryIndex];
        return state.structure[queryObj.query] ?? [];
    });

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
            groupId={groupId}
            isSelected={props.selectedItemIds.includes(pr.id)}
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

    let flattenedStructure = flattenStructure(structure);
    let prsNotInStructure = Object.keys(prs)
      .filter(prId => !flattenedStructure.includes(prId))
      .reduce((acc, prId) => ({...acc, [prId]: prs[prId] }), {});

    return <>
         <FilterInput
            value={filterText}
            onChange={setFilterText}
            onKeyDown={_handleFilterInputKeyDown} />
        
        { Object.keys(prs).length > 0 &&        
            <div className="pr-list" role="list">
                {
                    Object.keys(prsNotInStructure).map((prId, i) => {
                      return __renderPrListItem(prsNotInStructure[prId], i);
                    })

                    // structure
                    //     .map((data, i) => {
                    //     if (typeof data === 'string') {
                    //         return __renderPrListItem(prs[data], i)
                    //     }

                    //     return <PrListItemGroup 
                    //         key={data.id}
                    //         id={data.id}
                    //         index={i}
                    //         name={data.name}
                    //         isSelected={props.selectedItemIds.includes(data.id)}
                    //         onEditName={() => props.onEditGroupName(data.id)}
                    //         onDelete={() => props.onDeleteGroup(data.id)}
                    //         onAddPrToGroup={(prId) => props.onAddPrsToGroup([prId], data.id)}
                    //         onMove={props.onMove}
                    //         onSelect={() => _handleSelectItem(data.id)}
                    //     >
                    //         {data.prIds
                    //             .map((prId, gId) => __renderPrListItem(props.prs[prId], gId, data.id))
                    //             .filter(pr => pr !== null)
                    //         }
                    //     </PrListItemGroup>
                    // })
                }
            </div>
        }
    </>
}

export default PrList;

export function flattenStructure(structure) {
  return structure.reduce((acc, el) => {
      if (typeof el === 'string') {
          return [...acc, el]
      }
      return [...acc, ...el.prIds]
  }, []);
}
