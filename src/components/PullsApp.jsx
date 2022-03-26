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
import { useDispatch, useSelector } from 'react-redux';

import {groupPrs} from '../redux/structure_slice';

import {setActiveQuery} from '../redux/root_reducer.js';

import {selectSelectedPrIds} from '../redux/selectors';
import {clearSelection} from '../redux/selected_item_ids_slice';
import { fetchPrs } from '../redux/actions.js';


function PullsApp({ automation = false }) {
    let [ hasRequiredSettings, setHasRequiredSettings ] = useState(settings.hasRequiredSettings());
    useMenubarShow(() => setHasRequiredSettings(settings.hasRequiredSettings()));
    let [ selectedItemIds, setSelectedItemIds ] = useState([]);

    let dispatch = useDispatch();

    let queries = useSettings('githubQueries', []);

    let [query, setQuery] = useState({key: 'My PRs', value: 'is:open is:pr author:{githubUser} archived:false'});

    useMenubarHide(() => dispatch(clearSelection()));
    
    let selectedPrIds = useSelector(selectSelectedPrIds)

    useHotkeys('escape', () => ipcRenderer.send('hide-window'));
    useHotkeys('command+r', (e) => {
        e.preventDefault();
        dispatch(fetchPrs())
    });

    useHotkeys('command+o', _openSelectedPrs);
    useHotkeys('command+c', _copySelectedPrs);
    useHotkeys('command+g', () => dispatch(groupPrs(selectedPrIds)));

    for (let i = 0; i <= 8; i ++) {
        useHotkeys(`command+${i+1}`, () => {
            if (queries.length - 1 >= i) {
                dispatch(setActiveQuery(i))
            }
        })
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
            onOpenSelectedPrs={_openSelectedPrs}
            onCopySelectedPrs={_copySelectedPrs} />
            
        <PrList
            onHideWindow={() => ipcRenderer.send('hide-window')} />
        
        { automation && <input type="button" value="refresh" onClick={rerunQuery}/>}
    </div>
}

export default PullsApp;
