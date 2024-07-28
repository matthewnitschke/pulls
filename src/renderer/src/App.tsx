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
import { setActiveQuery } from "./redux/active_query_slice";
import { selectActiveQuery } from "./redux/selectors";


function App(): JSX.Element {
  let dispatch = useAppDispatch();
  let query = useAppSelector(selectActiveQuery);
  let activeQueryIndex = useAppSelector(state => state.activeQueryIndex);
  let selectedPrIds = useAppSelector(state => state.selectedPrs);

  useHotkeys('ctrl+r', () => dispatch(fetchPrs(activeQueryIndex)));

  for (let i = 0; i < 9; i ++) {
    useHotkeys(`Meta+${i + 1}`, () => {
      dispatch(setActiveQuery(i));
    });
  }

  useHotkeys('Meta+g', () => {
    if (selectedPrIds.length == 0) return;
    setOpen(true);
  });

  const [open, setOpen] = useState(false);

  return <Stack
    sx={{height: '100%'}}
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
