import { useAppDispatch, useAppSelector } from "./redux/store";
import Header from "./components/header/Header";
import { useHotkeys } from "react-hotkeys-hook";
import { fetchPrs } from "./redux/prs_slice";
import PrList from "./components/PrList";
import { Stack } from "@mui/material";
import { groupPrs } from "./redux/structure_slice";
import { useState } from "react";
import GroupNameDialog from "./components/utils/GroupNameDialog";
import { setSelectedPrs } from "./redux/selected_prs_slice";
import { setActiveRootQuery } from "./redux/active_root_query_slice";
import { selectActiveRootQuery } from "./redux/selectors";
import openUrls from "./utils/open_url";


function App(): JSX.Element {
  let dispatch = useAppDispatch();

  let query = useAppSelector(selectActiveRootQuery);
  let queries = useAppSelector(state => state.config.data.queries.map(({query}) => query));

  let selectedPrIds = useAppSelector(state => state.selectedPrs);
  let selectedPrUrls = useAppSelector(state => {
    let query = selectActiveRootQuery(state);
    if (query == null) return [];
    return state.selectedPrs.map(id => state.prs.data[query][id].url);
  });

  useHotkeys('ctrl+r', () => dispatch(fetchPrs(query)));

  for (let i = 0; i < 9; i ++) {
    useHotkeys(`Meta+${i + 1}`, () => {
      if (i >= queries.length) return;
      dispatch(setActiveRootQuery(queries[i]));
    });
  }

  useHotkeys('Meta+g', () => {
    if (selectedPrIds.length == 0) return;
    setOpen(true);
  });

  useHotkeys('Meta+o', () => {
    if (selectedPrIds.length == 0) return;
    openUrls(selectedPrUrls);
    dispatch(setSelectedPrs([]));
  });

  useHotkeys('esc', () => {
    dispatch(setSelectedPrs([]));
  });

  const [open, setOpen] = useState(false);

  return <Stack
    sx={{ height: '100%' }}
  >
    <Header onGroupClick={() => setOpen(true)}/>
    <PrList />
    <GroupNameDialog
      open={open}
      setOpen={(isOpen) => {
        setOpen(isOpen);

        if (!isOpen) {
          dispatch(setSelectedPrs([]))
        }
      }}
      onSubmit={(name) => {
        dispatch(groupPrs({ query, prs: selectedPrIds, name }))
      }}
    />
  </Stack>
}

export default App
