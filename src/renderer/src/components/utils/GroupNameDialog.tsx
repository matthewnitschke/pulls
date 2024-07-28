import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

interface GroupNameDialogProps {
  defaultName?: string
  submitButtonText?: string
  open: boolean
  setOpen(isOpen: boolean): void
  onSubmit(name: string): void
}

export default function GroupNameDialog(props: GroupNameDialogProps) {
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

        props.onSubmit(formJson.groupName);
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
        defaultValue={props.defaultName}
        name="groupName"
        label="Name"
        fullWidth
        variant="outlined"
      />
    </DialogContent>
    <DialogActions>
        <Button onClick={() => props.setOpen(false)}>Cancel</Button>
        <Button type="submit">{props.submitButtonText ?? 'Create'}</Button>
      </DialogActions>
  </Dialog>
}
