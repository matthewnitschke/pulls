import { createSlice, createAction, createAsyncThunk } from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid';
import { fetchPrs } from './actions';

import { selectActiveQuery } from './selectors';

export const groupPrs = createAsyncThunk(
  'groupPrs',
  async (prIds) => {
    let groupName = await swal({
      title: 'ENTER NAME OF GROUP',
      content: 'input'
    });

    return { prIds, groupName }
  }
)

export const renameGroup = createAsyncThunk(
  'renameGroup',
  async (groupId, { getState }) => {
    let state = getState();
    let currentQuery = selectActiveQuery(state)

    let currentGroupName = state.structure[currentQuery]
      .find(el => el.id == groupId)
      .name;

    let groupName = await swal({
        title: `ENTER THE NEW NAME OF "${currentGroupName}"`,
        content: 'input'
    });

    return { groupId, groupName }
  }
)

const structureSlice = createSlice({
  name: 'structure',
  initialState: {},
  reducers: {
    move: {
      reducer: (state, action) => {
        let { itemId, index, groupId } = action.payload;
        let structure = state[action.meta.activeQuery];

        let enclosingGroupPrIds = structure
          .find(el => el.prIds?.includes(itemId))
          ?.prIds
    
        let element;
        if (enclosingGroupPrIds != null) {
            // itemId is within a group

            // itemId isn't a group, so just copy its value
            element = itemId;

            enclosingGroupPrIds.splice(enclosingGroupPrIds.indexOf(itemId), 1);
        } else {
            let itemIndex = structure
                .map(el => el.id ?? el)
                .indexOf(itemId)
    
            element = structure[itemIndex];
            structure.splice(itemIndex, 1);
        }
    
        if (groupId != null) {
          let newGroup = structure.find(el => el.id == groupId)
          newGroup.prIds.splice(index, 0, element)
        } else {
          structure.splice(index, 0, element)
        }
      },
      prepare: (itemId, index, groupId) => ({payload: { itemId, index, groupId }})
    },
    deleteGroup: (state, action) => {
      let groupId = action.payload;
      let structure = state[action.meta.activeQuery];

      let group = structure.find(el => el.id == groupId);
      structure.splice(structure.indexOf(group), 1, ...group.prIds)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrs.fulfilled, (state, action) => {
        let query = action.meta.activeQuery;
        let flattenedStructure = flattenStructure(state[query] ?? []);

        state[query] = [
          ...Object.keys(action.payload).filter(prId => !flattenedStructure.includes(prId)),
          ...state[query] ?? []
        ]
      })

    builder
      .addCase(groupPrs.fulfilled, (state, action) => {
        let { prIds, groupName } = action.payload;

        let structure = state[action.meta.activeQuery];

        structure[structure.indexOf(prIds[0])] = {
          id: uuid(),
          name: groupName,
          prIds
        }

        // delete other prIds from the root
        prIds.slice(1).forEach((prId) => {
          structure.splice(structure.indexOf(prId), 1)
        })
      })

    builder
      .addCase(renameGroup.fulfilled, (state, action) => {
        let { groupId, groupName } = action.payload;

        let structure = state[action.meta.activeQuery];
        let group = structure.find(el => el.id == groupId);
        group.name = groupName;
      })
  }
})

export function flattenStructure(structure) {
  if (structure == null) return [];
  
  return structure.reduce((acc, el) => {
    if (typeof el === 'string') {
      return [...acc, el]
    }
    return [...acc, ...el.prIds]
  }, []);
}

export default structureSlice.reducer;
export const { move, deleteGroup } = structureSlice.actions
