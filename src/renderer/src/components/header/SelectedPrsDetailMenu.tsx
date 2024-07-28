import { Launch, Layers, MoreVert } from "@mui/icons-material";
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from "@mui/material";
import { setSelectedPrs } from "@renderer/redux/selected_prs_slice";
import { selectActiveQuery } from "@renderer/redux/selectors";
import { useAppDispatch, useAppSelector } from "@renderer/redux/store";
import openUrls from "@renderer/utils/open_url";
import { useState } from "react";

interface SelectedPrsDetailMenuProps {
  onGroupClick: () => void;
}

export default function SelectedPrsDetailMenu(props: SelectedPrsDetailMenuProps) {
  let dispatch = useAppDispatch();
  let selectedPrData = useAppSelector(state => {
    let activeQuery = selectActiveQuery(state);
    if (activeQuery == null) return [];
    return state.selectedPrs.map((pr) => state.prs.data[activeQuery][pr]);
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClose = () => setAnchorEl(null);

  return <>
    <IconButton
      onClick={(e) => setAnchorEl(e.currentTarget as any)}
    ><MoreVert /></IconButton>

    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      sx={{ minWidth: 200 }}
    >
        <MenuItem
          onClick={() => {
            handleClose();
            props.onGroupClick();
          }}
        >
          <ListItemIcon>
            <Layers fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>Group</ListItemText>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ pl: 1 }}
          >
            ⌘G
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            openUrls(selectedPrData.map(({url}) => url));
            dispatch(setSelectedPrs([]));
          }}
        >
          <ListItemIcon>
            <Launch fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>Open</ListItemText>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ pl: 1 }}
          >
            ⌘O
          </Typography>
        </MenuItem>
      </Menu>
  </>
}
