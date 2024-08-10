import Typography from "@mui/material/Typography";
import { ChevronRight, LayersClear, ModeEdit, MoreVert } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@renderer/redux/store";
import { Box, IconButton, ListItem, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { renameGroup, ungroupPrs } from "@renderer/redux/structure_slice";
import { selectActiveQuery } from "@renderer/redux/selectors";
import { NodeModel } from "@minoru/react-dnd-treeview";
import GroupNameDialog from "./utils/GroupNameDialog";

interface FolderNodeProps {
  node: NodeModel;
  depth: number;
  onToggle(): void;
  isOpen: boolean;
}

export const FolderNode = (props: FolderNodeProps) => {
  const { text } = props.node;
  const indent = props.depth * 35;

  const isAtStart = useAppSelector((state) => {
    const query = selectActiveQuery(state);
    if (query == null) return false;

    return state.structure[query][0].id === props.node.id;
  });

  return (
    <Box
      sx={{ marginLeft: `${indent}px`, marginTop: '-1px'}}
    >
      <ListItem
        sx={{
          borderBottom: 'solid 1px #373e47',
          borderTop: !isAtStart ? 'solid 1px #373e47' : '',

          // not using ListItemButton because it's hover animation is
          // laggy, and it annoyed me
          '&:hover': {
            cursor: 'pointer',
            backgroundColor: '#2d323a',
          },

          '& .MuiListItemSecondaryAction-root .MuiIconButton-root:not(.open)': { visibility: 'hidden' },
          '&:hover .MuiListItemSecondaryAction-root .MuiIconButton-root': { visibility: 'inherit' }
        }}
        secondaryAction={<FolderDetailsMenu id={props.node.id as string} text={text}/>}
        onClick={props.onToggle}
      >
          <ListItemIcon>
            <ChevronRight sx={{
              transition: 'transform linear 0.1s',
              transform: props.isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            }}/>
          </ListItemIcon>

          <ListItemText>
            <Typography
              component='span'
              color='secondary'
              sx={{ fontSize: '1.07rem'}}
            >{text}</Typography>
          </ListItemText>
      </ListItem>
    </Box>
  );
}


interface FolderDetailsMenuProps {
  id: string,
  text: string,
}
const FolderDetailsMenu = (props: FolderDetailsMenuProps) => {
  let dispatch = useAppDispatch();

  let query = useAppSelector(selectActiveQuery);

  let [anchorEl, setAnchorEl] = useState(null);
  let open = Boolean(anchorEl);
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget as any);
  };
  const handleClose = () => setAnchorEl(null);

  const [nameDialogOpen, setNameDialogOpen] = useState(false);

  return <Fragment>
    <IconButton
      edge='end'
      className={open ? 'open' : ''}
      onClick={handleClick}
    ><MoreVert/></IconButton>
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <MenuItem onClick={() => {
        dispatch(ungroupPrs({query, groupId: props.id}))
        handleClose()
      }}>
        <ListItemIcon>
          <LayersClear />
        </ListItemIcon>
        <ListItemText>Ungroup</ListItemText>
      </MenuItem>

      <MenuItem onClick={() => {
        setNameDialogOpen(true);
        handleClose()
      }}>
        <ListItemIcon><ModeEdit/></ListItemIcon>
        <ListItemText>Rename</ListItemText>
      </MenuItem>
    </Menu>

    <GroupNameDialog
      open={nameDialogOpen}
      setOpen={setNameDialogOpen}
      onSubmit={(name) => {
        dispatch(renameGroup({ query, groupId: props.id, name }))
      }}
      defaultName={props.text}
      submitButtonText="Rename"
    />
  </Fragment>
}
