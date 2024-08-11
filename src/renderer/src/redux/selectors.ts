import { RootState } from "./store";

export function selectActiveQuery(state: RootState) {
  if (state.config.data.queries.length === 0) return null;
  return state.config.data.queries[state.activeQueryIndex].query;
}
