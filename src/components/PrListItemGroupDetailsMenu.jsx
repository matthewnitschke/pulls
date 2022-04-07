import React from "react";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LayersClearIcon from "@mui/icons-material/LayersClear";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
function PrListItemGroupMenuItem(props) {
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
        <MenuItem
          onClick={(e) => {
            handleClose(e);
            props.onUngroupClick();
          }}
        >
          <ListItemIcon>
            <LayersClearIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>Ungroup</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            handleClose(e);
            props.onRenameClick();
          }}
        >
          <ListItemIcon>
            <ModeEditIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

export default PrListItemGroupMenuItem;
