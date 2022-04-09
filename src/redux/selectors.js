import { flattenStructure } from './structure_slice';

export function selectActiveQuery(state) {
  return state.config.queries[state.activeQueryIndex]?.query;
}

export function selectSelectedPrIds(state) {
  let activeQuery = selectActiveQuery(state);
  if (activeQuery == null) return [];

  let flattenedStructure = flattenStructure(state.structure[activeQuery]);

  return state.selectedItemIds.filter((itemId) => flattenedStructure.includes(itemId));
}
