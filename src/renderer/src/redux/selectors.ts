import { RootState } from "./store";

export function selectActiveRootQuery(state: RootState) {
  return state.activeRootQuery;
  // if (state.config.data.queries.length === 0) return null;
  // return state.config.data.queries[state.activeQueryIndex].query;
}
