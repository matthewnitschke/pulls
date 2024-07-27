import { NodeModel } from "@minoru/react-dnd-treeview";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchPrs } from "./prs_slice";

export const loadStructure = createAsyncThunk<
  StructureSliceState,
  void,
  {}
>(
  'loadStructure',
  async (_) => window.electron.ipcRenderer.invoke('get-structure')
);
type StructureSliceState = {
 [query: string]: NodeModel[]
}

const initialState: StructureSliceState = {}

const structureSlice = createSlice({
  name: 'structure',
  initialState,
  reducers: {
    updateStructure: (state, action: PayloadAction<{query: string, nodes: NodeModel[]}>) => {
      let nodes = action.payload.nodes;
      let filteredNodes = nodes.filter((node) => {
        // if the node is not droppable, it is not a group, keep it
        if (!node.droppable) return true;

        // if the node has no children, delete it
        return nodes.some((n) => n.parent == node.id);
      })

      state[action.payload.query] = filteredNodes;
    },
    groupPrs: (state, action) => {
      let query = action.payload.query;
      let groupGrIds = action.payload.prs;
      let groupName = action.payload.name;

      let newGroupIndex = state[query].findIndex((node) => node.id == groupGrIds[0]);

      let newId = Date.now().toString(); // prolly update this to be a uuid

      state[query].splice(newGroupIndex, 0, {
        id: newId,
        parent: state[query][newGroupIndex].parent,
        text: groupName,
        droppable: true,
      });

      for (let pr of state[query]) {
        if (groupGrIds.includes(pr.id)) {
          pr.parent = newId;
        }
      }
    },
    ungroupPrs: (state, action) => {
      let query = action.payload.query;
      let groupId = action.payload.groupId;

      for (let pr of state[query]) {
        if (pr.parent == groupId) {
          pr.parent = 0;
        }
      }
      state[query] = state[query].filter((pr) => pr.id != groupId);
    }
  },
  extraReducers: (builder) => builder
    .addCase(fetchPrs.fulfilled, (state, action) => {
      for (let [query, prs] of Object.entries(action.payload)) {
        state[query] ??= [];

        let currentIds = Object.values(state[query] ?? []).map((pr) => pr.id);

        Object.values(prs)
          .filter((pr) => !currentIds.includes(pr.id))
          .map((pr) => ({
            id: pr.id,
            parent: 0,
            text: pr.name,
            droppable: false,
          }))
          .forEach((node) => state[query].unshift(node))
      }
    })
    .addCase(loadStructure.fulfilled, (_, action) => action.payload)
});

export default structureSlice.reducer;
export const { updateStructure, groupPrs, ungroupPrs } = structureSlice.actions;
