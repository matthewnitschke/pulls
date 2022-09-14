import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import { fetchPrs } from './prs_slice';

import { settingsStore } from '../utils';

import { selectActiveQuery } from './selectors';

import swal from 'sweetalert';
import queryGithub from '../github_client';

export const groupPrs = createAsyncThunk('groupPrs', async (prIds) => {
  let groupName = await swal({
    title: 'ENTER NAME OF GROUP',
    content: 'input',
  });

  return { prIds, groupName };
});

export const renameGroup = createAsyncThunk('renameGroup', async (groupId, { getState }) => {
  let state = getState();
  let currentQuery = selectActiveQuery(state);

  let currentGroupName = state.structure[currentQuery].find((el) => el.id == groupId).name;

  let groupName = await swal({
    title: `ENTER THE NEW NAME OF "${currentGroupName}"`,
    content: 'input',
  });

  return { groupId, groupName };
});

// Github search is known to be a bit flakey sometimes. This results is random responses that dont contain all pr data
// in order to combat this, synchronizeStructure is run on a long interval (6hrs or so)
// 
// [synchronizeStructure] is a process that takes each defined query, runs duplicate requests against github 3 times, and 
// resets structure based on the mode of the prIds (most common)
export const synchronizeStructure = createAsyncThunk('synchronizeStructure', async (_, { getState }) => {
  let state = getState();

  let queries = state.config.queries.map(({ query }) => query);

  let queryRes = {};
  for (let query of queries) {
    let queryIter = [];
    for (let i = 0; i < 3; i ++) {
      queryIter.push(await queryGithub(query, state.config.githubToken));
    }
    
    let queryStrings = queryIter.map((res) => Object.keys(res).join(','))
    
    queryRes[query] = mode(queryStrings).split(',')
  }

  return queryRes
});

const structureSlice = createSlice({
  name: 'structure',
  initialState: settingsStore.get('structure') ?? {},
  reducers: {
    move: {
      reducer: (state, action) => {
        let { itemId, index, groupId } = action.payload;
        let structure = state[action.meta.activeQuery];

        let enclosingGroupPrIds = structure.find((el) => el.prIds?.includes(itemId))?.prIds;

        let element;
        if (enclosingGroupPrIds != null) {
          // itemId is within a group

          // itemId isn't a group, so just copy its value
          element = itemId;

          enclosingGroupPrIds.splice(enclosingGroupPrIds.indexOf(itemId), 1);
        } else {
          let itemIndex = structure.map((el) => el.id ?? el).indexOf(itemId);

          element = structure[itemIndex];
          structure.splice(itemIndex, 1);
        }

        if (groupId != null) {
          let newGroup = structure.find((el) => el.id == groupId);
          newGroup.prIds.splice(index, 0, element);
        } else {
          structure.splice(index, 0, element);
        }
      },
      prepare: (itemId, index, groupId) => ({
        payload: { itemId, index, groupId },
      }),
    },
    deleteGroup: (state, action) => {
      let groupId = action.payload;
      let structure = state[action.meta.activeQuery];

      let group = structure.find((el) => el.id == groupId);
      structure.splice(structure.indexOf(group), 1, ...group.prIds);
    },

    toggleGroupOpen: (state, action) => {
      let groupId = action.payload;
      let structure = state[action.meta.activeQuery];

      let group = structure.find((el) => el.id == groupId);
      group.isOpen = !group.isOpen;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPrs.fulfilled, (state, action) => {
      let query = action.payload.activeQuery;
      let flattenedStructure = flattenStructure(state[query] ?? []);

      state[query] = [
        ...Object.keys(action.payload.resp).filter((prId) => !flattenedStructure.includes(prId)),
        ...(state[query] ?? []),
      ];
    });

    builder.addCase(groupPrs.fulfilled, (state, action) => {
      let { prIds, groupName } = action.payload;

      let structure = state[action.meta.activeQuery];

      structure[structure.indexOf(prIds[0])] = {
        id: uuid(),
        name: groupName,
        isOpen: false,
        prIds,
      };

      // delete other prIds from the root
      prIds.slice(1).forEach((prId) => {
        structure.splice(structure.indexOf(prId), 1);
      });
    });

    builder.addCase(renameGroup.fulfilled, (state, action) => {
      let { groupId, groupName } = action.payload;

      let structure = state[action.meta.activeQuery];
      let group = structure.find((el) => el.id == groupId);
      group.name = groupName;
    });

    builder.addCase(synchronizeStructure.fulfilled, (state, action) => {
      let queries = action.payload;

      return Object.keys(queries).reduce((acc, query) => {
        acc[query] = filterStructure(state[query], prId => queries[query].includes(prId))
        return acc;
      }, {});
    });
  },
});

export function flattenStructure(structure) {
  if (structure == null) return [];

  return structure.reduce((acc, el) => {
    if (typeof el === 'string') {
      return [...acc, el];
    }
    return [...acc, ...el.prIds];
  }, []);
}

export function filterStructure(structure, filterLambda) {
  return (structure ?? {}).reduce((acc, el) => {
      if (typeof el === 'string') {
          if (filterLambda(el)) {
              return [...acc, el]
          }
          return acc
      }

      let newGroupIds = el.prIds.filter(filterLambda)
      if (newGroupIds.length <= 0) return acc;
      return [
          ...acc,
          {...el, prIds: newGroupIds}
      ]
  }, [])
}


function mode(arr) {
  return arr.sort((a, b) =>
    arr.filter(v => v === a).length
    - arr.filter(v => v === b).length
  ).pop();
}

export default structureSlice.reducer;
export const { move, deleteGroup, toggleGroupOpen } = structureSlice.actions;
