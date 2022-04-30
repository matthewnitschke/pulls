// Node
const { ipcRenderer, clipboard } = require('electron');

// Libraries
import React, { useEffect } from 'react';
import { openUrl } from '../utils.js';

// Components
import PrList from './PrList.jsx';
import Header from './header/Header.jsx';

// Hooks
import { useMenubarHide, useMenubarShow } from '../hooks/useMenubarEvents.js';
import useHotkeys from '../hooks/useHotkeys.js';
import { useDispatch, useSelector } from 'react-redux';

import { groupPrs } from '../redux/structure_slice';

import { setActiveQuery } from '../redux/root_reducer.js';

import { selectActiveQuery, selectSelectedPrIds } from '../redux/selectors';
import { clearSelection } from '../redux/selected_item_ids_slice';
import { fetchPrs } from '../redux/prs_slice';
import { synchronizeStructure } from '../redux/structure_slice';
import toMils from 'to-mils';

function PullsApp({ automation = false }) {
  let dispatch = useDispatch();

  let queries = useSelector((state) => state.config.queries ?? []);
  let prs = useSelector((state) => state.prs.data[selectActiveQuery(state)]);
  let selectedPrIds = useSelector(selectSelectedPrIds);

  let queryInterval = useSelector((state) => state.config.queryInterval ?? '5min');
  useEffect(() => {
    let sub = setInterval(() => {
      dispatch(fetchPrs());
    }, toMils(queryInterval));

    return () => clearInterval(sub);
  }, [queryInterval]);

  useMenubarHide(() => dispatch(clearSelection()));
  useMenubarShow(() => dispatch(fetchPrs()));

  useHotkeys('escape', () => ipcRenderer.send('hide-window'));
  useHotkeys('command+r', (e) => {
    e.preventDefault();
    dispatch(fetchPrs());
  });

  useHotkeys('command+o', _openSelectedPrs);
  useHotkeys('command+c', _copySelectedPrs);
  useHotkeys('command+g', () => dispatch(groupPrs(selectedPrIds)));

  for (let i = 0; i <= 8; i++) {
    useHotkeys(`command+${i + 1}`, () => {
      if (queries.length - 1 >= i) {
        dispatch(setActiveQuery(i));
      }
    });
  }

  function _openSelectedPrs() {
    selectedPrIds.map((id) => prs[id].prUrl).map(openUrl);

    setSelectedItemIds([]);
  }

  function _copySelectedPrs() {
    let prText = selectedPrIds
      .map((id) => prs[id])
      .map((pr) => `${pr.prUrl} (${pr.name})`)
      .join('\n');

    clipboard.writeText(prText, 'selection');
  }

  return (
    <div className="pulls-app">
      <Header onOpenSelectedPrs={_openSelectedPrs} onCopySelectedPrs={_copySelectedPrs} />

      <PrList onHideWindow={() => ipcRenderer.send('hide-window')} />

      {automation && <input type="button" value="refresh" onClick={rerunQuery} />}
      <input type="button" value="sync" onClick={() => dispatch(synchronizeStructure())} />
    </div>
  );
}

export default PullsApp;
