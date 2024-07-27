import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import useHotkeys from "@reecelucas/react-use-hotkeys";
import { selectActiveQuery } from "@renderer/redux/selectors";
import { useAppDispatch, useAppSelector } from "@renderer/redux/store";
import { groupPrs } from "@renderer/redux/structure_slice";

interface GroupPrsDialogProps {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}

export function GroupPrsDialog(props: GroupPrsDialogProps) {
  let dispatch = useAppDispatch();

  let query = useAppSelector(selectActiveQuery);
  let selectedPrIds = useAppSelector(state => state.selectedPrs);

  useHotkeys('Meta+g', () => {
    if (selectedPrIds.length == 0) return;
    props.setOpen(true);
  });

  return <Dialog
    open={props.open}
    onClose={() => props.setOpen(false)}
    disableRestoreFocus
    PaperProps={{
      component: 'form',
      elevation: 0,
      sx: {
        minWidth: 300,
      },
      onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());

        dispatch(groupPrs({
          query,
          prs: selectedPrIds,
          name: formJson.groupName,
        }))

        props.setOpen(false);
      },
    }}
  >
    <DialogTitle>Enter Name of Group</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        required
        margin="dense"
        name="groupName"
        label="Name"
        fullWidth
        variant="outlined"
      />
    </DialogContent>
    <DialogActions>
        <Button onClick={() => props.setOpen(false)}>Cancel</Button>
        <Button type="submit">Create</Button>
      </DialogActions>
  </Dialog>
}
