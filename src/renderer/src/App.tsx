import { useSelector } from "react-redux"
import { RootState, useAppDispatch, useAppSelector } from "./redux/store";
import Header from "./components/Header";
import { useHotkeys } from "react-hotkeys-hook";
import { fetchPrs } from "./redux/prs_slice";
import PrList from "./components/PrList";
import { Fragment } from "react/jsx-runtime";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Modal, Stack, TextField, Typography } from "@mui/material";
import { groupPrs } from "./redux/structure_slice";
import { useState } from "react";
import { GroupPrsDialog } from "./components/GroupPrsDialog";
import { setSelectedPrs } from "./redux/selected_prs_slice";
import { setActiveQuery } from "./redux/active_query_slice";


function App(): JSX.Element {
  let dispatch = useAppDispatch();
  let activeQueryIndex = useAppSelector(state => state.activeQueryIndex);

  useHotkeys('ctrl+r', () => dispatch(fetchPrs(activeQueryIndex)));

  for (let i = 0; i < 9; i ++) {
    useHotkeys(`Meta+${i + 1}`, () => {
      dispatch(setActiveQuery(i));
    });
  }

  const [open, setOpen] = useState(false);

  return <Stack
    sx={{height: '100%'}}
  >
    <Header />
    <PrList />
    <GroupPrsDialog
      open={open}
      setOpen={(isOpen) => {
        setOpen(isOpen);

        if (!isOpen) {
          dispatch(setSelectedPrs([]))
        }
      }}
    />
  </Stack>
}

export default App
