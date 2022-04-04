import React from "react";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useDispatch } from "react-redux";
import Icon from '@material-ui/core/Icon'

import { executeAction } from '../redux/actions_slice'

export default function ItemActionsMenu(props) {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const handleClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <>
      <MoreVertIcon
        onClick={handleClick}
        className={`${open ? "is-open" : ""}`}
        color="primary"
        fontSize="medium"
      />
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {props.actions.map((actionEl) => (
          <MenuItem
            key={actionEl.actionKey}
            onClick={() => dispatch(executeAction({ actionKey: actionEl.actionKey, itemId: props.itemId }))}
          >
            <ListItemText>{actionEl.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
