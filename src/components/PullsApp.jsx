// Node
const { ipcRenderer, clipboard } = require('electron');

const settings = require('./settings/settings-utils.js');

// Libraries
import React, { useCallback, useState } from 'react';
import swal from 'sweetalert';
import { openUrl } from '../utils.js';

// Components
import PrList from './PrList.jsx';
import Header from './header/Header.jsx';
import MissingRequiredSettingsView from './MissingRequiredSettingsView.jsx';

// Hooks
import { usePrData } from '../hooks/usePrData.js';
import { useSettings } from '../hooks/useSettings.js';
import { useMenubarShow, useMenubarHide } from '../hooks/useMenubarEvents.js';
import useHotkeys from '../hooks/useHotkeys.js';
import useStructure, { flattenStructure } from '../hooks/useStructure.js';


function PullsApp({ automation = false }) {
    let [ hasRequiredSettings, setHasRequiredSettings ] = useState(settings.hasRequiredSettings());
    useMenubarShow(() => setHasRequiredSettings(settings.hasRequiredSettings()));
    let [ selectedItemIds, setSelectedItemIds ] = useState([]);

    let queries = useSettings('githubQueries', []);

    let [query, setQuery] = useState({key: 'My PRs', value: 'is:open is:pr author:{githubUser} archived:false'});
    
    let { prs, prOrder, isRunning, rerunQuery } = usePrData(
        query.value,
        (structureToResetTo) => resetStructure(structureToResetTo),
    );

    let { 
        structure,
        groupPrs,
        addPrsToGroup,
        deleteGroup,
        setGroupName,
        moveGroup,
        move,
        resetStructure
     } = useStructure(query.value, prOrder);

    useMenubarHide(() => setSelectedItemIds([]));
    
    let structurePrIds = flattenStructure(structure);
    let selectedPrIds = selectedItemIds.filter(id => structurePrIds.includes(id));

    useHotkeys('escape', () => ipcRenderer.send('hide-window'));
    useHotkeys('command+r', (e) => {
        e.preventDefault();
        rerunQuery();
    });

    useHotkeys('command+o', _openSelectedPrs);
    useHotkeys('command+c', _copySelectedPrs);
    useHotkeys('command+g', () => _groupPrs(selectedPrIds));

    for (let i = 0; i <= 8; i ++) {
        useHotkeys(`command+${i+1}`, () => {
            if (queries.length - 1 >= i) {
                setQuery(queries[i]);
            }
        })
    }

    async function _groupPrs(prIds) {
        let groupName = await swal({
            title: 'ENTER NAME OF GROUP',
            content: 'input'
        });

        if (groupName) {
            groupPrs(prIds, groupName);
            setSelectedItemIds([]);
        }
    }
    

    function _openSelectedPrs() {
        selectedPrIds.map(id => prs[id].prUrl).map(openUrl);
        setSelectedItemIds([]);
    }

    function _copySelectedPrs() {
        let prText = selectedPrIds
            .map(id => prs[id])
            .map(pr => `${pr.prUrl} (${pr.name})`)
            .join('\n')
        
        clipboard.writeText(prText, 'selection')
    }

    if (!hasRequiredSettings) {
        return <MissingRequiredSettingsView />
    }

    return <div className='pulls-app'>
        <Header
            currentQuery={query}
            queries={queries} 
            onSetQuery={setQuery} 
            selectedItemIds={selectedItemIds} 
            onGroupSelectedPrs={() => _groupPrs(selectedPrIds)}
            onOpenSelectedPrs={_openSelectedPrs}
            onCopySelectedPrs={_copySelectedPrs}
            isQueryRunning={isRunning} />
            
        <PrList
            prs={prs}
            structure={structure}
            selectedItemIds={selectedItemIds}
            onHideWindow={() => ipcRenderer.send('hide-window')}
            setSelectedItemIds={setSelectedItemIds}
            onGroupPrs={_groupPrs}
            onAddPrsToGroup={addPrsToGroup}
            onEditGroupName={async (groupId) => {
                let group = structure.find(el => el.id == groupId)
                let groupName = await swal({
                    title: `ENTER THE NEW NAME OF "${group.name}"`,
                    content: 'input'
                });
        
                if (groupName) {
                    setGroupName(groupId, groupName);
                    setSelectedItemIds([])
                }
            }}
            onDeleteGroup={async (groupId) => {
                deleteGroup(groupId);
                setSelectedItemIds([])
            }} 
            onMoveGroup={moveGroup} 
            onMove={move} />
        
        { automation && <input type="button" value="refresh" onClick={rerunQuery}/>}
    </div>
}

export default PullsApp;