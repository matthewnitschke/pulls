import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import { fetchPrs } from './prs_slice';

import { settingsStore } from '../utils';

import { selectActiveQuery } from './selectors';

import swal from 'sweetalert';

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
      let arg = action.meta.arg;

      // if parent is null, this is the fulfilled result of the root query
      if (arg.parent == null) {
        let flattenedStructure = flattenStructure(state[arg.query] ?? []);
  
        state[arg.query] = [
          ...Object.keys(action.payload).filter((prId) => !flattenedStructure.includes(prId)),
          ...(state[arg.query] ?? []),
        ];
      } else {
        let childIndex = state[arg.parent].findIndex((item) => item.query == arg.query)

        if (childIndex == -1) {
          state[arg.parent][0] = {
            id: uuid(),
            isOpen: false,
            query: arg.query,
            name: arg.groupName,
            prIds: Object.keys(action.payload)
          }
        } else {
          let queryPrIds = Object.keys(action.payload);
          let currentPrIds = state[arg.parent][childIndex].prIds;

          let newPrIds = [
            // add any new prs found from the result of the query
            ...queryPrIds.filter((prId) => !currentPrIds.includes(prId)),

            // filter the current prs from the result of the query. Persist the order
            ...currentPrIds.filter((prId) => queryPrIds.includes(prId))
          ]

          state[arg.parent][childIndex].prIds = newPrIds
        }
      }
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

export default structureSlice.reducer;
export const { move, deleteGroup, toggleGroupOpen } = structureSlice.actions;
