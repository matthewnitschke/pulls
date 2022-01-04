// Node
const { ipcRenderer, clipboard } = require('electron');

const settings = require('./settings/settings-utils.js');

// Libraries
import React, { useState } from 'react';
import swal from 'sweetalert';
import { openUrl, removeTicketFromPrTitle } from '../utils.js';

// Components
import PrList from './PrList.jsx';
import Header from './header/Header.jsx';
import MissingRequiredSettingsView from './MissingRequiredSettingsView.jsx';

// Hooks
import { usePrData } from '../hooks/usePrData.js';
import { useMenubarShow, useMenubarHide } from '../hooks/useMenubarEvents.js';
import useHotkeys from '../hooks/useHotkeys.js';
import useStructure, { flattenStructure } from '../hooks/useStructure.js';


function PullsApp({ automation = false }) {
    let [ hasRequiredSettings, setHasRequiredSettings ] = useState(settings.hasRequiredSettings());
    useMenubarShow(() => setHasRequiredSettings(settings.hasRequiredSettings()));
    let [ selectedItemIds, setSelectedItemIds ] = useState([]);
    
    let { prs, prOrder, rerunQuery } = usePrData();
    let { structure, groupPrs, addPrsToGroup, deleteGroup, setGroupName, moveGroup, move } = useStructure(prOrder);

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
            .map(pr => `${pr.prUrl} (${removeTicketFromPrTitle(pr.name)})`)
            .join('\n')
        
        clipboard.writeText(prText, 'selection')
    }

    if (!hasRequiredSettings) {
        return <MissingRequiredSettingsView />
    }

    return <div className='pulls-app'>
        <Header
            selectedItemIds={selectedItemIds}
            structure={structure}
            onGroupSelectedPrs={() => _groupPrs(selectedPrIds)}
            onAddToSelectedGroup={() => {
                let selectedGroupId = selectedItemIds.find(el => !selectedPrIds.includes(el))
                addPrsToGroup(selectedPrIds, selectedGroupId);
                setSelectedItemIds([])
            }}
            onOpenSelectedPrs={_openSelectedPrs}
            onCopySelectedPrs={_copySelectedPrs} />

        <PrList
            prs={prs}
            structure={structure}
            selectedItemIds={selectedItemIds}
            onHideWindow={() => ipcRenderer.send('hide-window')}
            setSelectedItemIds={setSelectedItemIds}
            onGroupPrs={_groupPrs}
            onMove={move}
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