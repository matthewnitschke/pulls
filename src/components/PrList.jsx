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
            filterText={filterText}
            name={pr.name}
            repo={pr.repo}
            isClosed={pr.prState == 'closed'}
            url={pr.prUrl}
            prStatus={pr.prStatus}
            prStatusContexts={pr.prStatusContexts} />;
    }

    return <>
         <FilterInput
            value={filterText}
            onChange={setFilterText}
            onKeyDown={_handleFilterInputKeyDown} />
        
        { Object.keys(prs).length > 0 &&        
            <div className="pr-list" role="list">
                {
                    structure
                        .map((data, i) => {
                        if (typeof data === 'string') {
                            return __renderPrListItem(prs[data], i)
                        }

                        return <PrListItemGroup 
                            key={data.id}
                            id={data.id}
                            index={i}
                            name={data.name}
                        >
                            {data.prIds
                                .map((prId, gId) => __renderPrListItem(prs[prId], gId, data.id))
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

export function flattenStructure(structure) {
  return structure.reduce((acc, el) => {
      if (typeof el === 'string') {
          return [...acc, el]
      }
      return [...acc, ...el.prIds]
  }, []);
}
