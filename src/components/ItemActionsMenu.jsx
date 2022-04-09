import React from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';

import { executeAction } from '../redux/actions_slice';

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

  let runningActions = useSelector((state) => state.actions[props.itemId] ?? {})

  return (
    <>
      <MoreVertIcon 
        onClick={handleClick} 
        className={`${open ? 'is-open' : ''}`} 
        color="primary" 
        fontSize="medium" />
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {props.actions.map((actionEl) => (
          <MenuItem
            key={actionEl.actionKey}
            onClick={(e) => {
              e.stopPropagation();
              dispatch(executeAction({ actionKey: actionEl.actionKey, itemId: props.itemId }));
            }}
          >
            <ListItemText>{actionEl.label}</ListItemText>

            {runningActions[actionEl.actionKey]?.status == 'running' &&
              <CircularProgress size="1rem" />
            }
            {runningActions[actionEl.actionKey]?.status == 'errored' && (
              <ErrorOutlineIcon size="1rem" />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
