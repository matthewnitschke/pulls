import Typography from "@mui/material/Typography";
import { ChevronRight, LayersClear, ModeEdit, MoreVert } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@renderer/redux/store";
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { ungroupPrs } from "@renderer/redux/structure_slice";
import { selectActiveQuery } from "@renderer/redux/selectors";
import { NodeModel } from "@minoru/react-dnd-treeview";


export const FolderNode = (
  props: {
    node: NodeModel,
    depth: number,
    onToggle: () => {},
    isOpen: boolean,
}) => {
  const { text } = props.node;
  const indent = props.depth * 30;

  return (
    <ListItem
      style={{ paddingLeft: indent }}
      disablePadding
      sx={{
        borderBottom: 'solid 1px #373e47',

        '& .MuiListItemSecondaryAction-root .MuiIconButton-root:not(.open)': { visibility: 'hidden' },
        '&:hover .MuiListItemSecondaryAction-root .MuiIconButton-root': { visibility: 'inherit' }
      }}
      secondaryAction={<FolderDetailsMenu id={props.node.id}/>}
    >
      <ListItemButton
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
            fontWeight={500}
          >{text}</Typography>
        </ListItemText>
      </ListItemButton>
    </ListItem>
  );
}


const FolderDetailsMenu = (props: {id: string | number}) => {
  let dispatch = useAppDispatch();

  let query = useAppSelector(selectActiveQuery);

  let [anchorEl, setAnchorEl] = useState(null);
  let open = Boolean(anchorEl);
  const handleClick = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget as any);
  const handleClose = () => setAnchorEl(null);

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
        // dispatch(ungroupPrs(props.id))
        handleClose()
      }}>
        <ListItemIcon><ModeEdit/></ListItemIcon>
        <ListItemText>Rename</ListItemText>
      </MenuItem>
    </Menu>
  </Fragment>
}
