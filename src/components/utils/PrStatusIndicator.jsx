import React from 'react';

import Popover from '@mui/material/Popover';

import { makeStyles } from '@material-ui/core/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import StatusIcon from './PrStatusIcon';

import { openUrl } from '../../utils.js';

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none',
  },
  popoverContent: {
    pointerEvents: 'auto',
  },
}));

export default function PrStatusIndicator(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [arrow, setArrow] = React.useState(null);
  const arrowRef = React.useRef();

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const classes = useStyles();

  const open = Boolean(anchorEl);

  return (
    <>
      <div aria-haspopup="true" onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
        <StatusIcon state={props.state} />
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handlePopoverClose}
          className={classes.popover}
          classes={{
            paper: classes.popoverContent,
          }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          {props.contexts?.map((el, i) => (
            <MenuItem
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                openUrl(el.targetUrl);
              }}
            >
              <>
                <StatusIcon state={el.state} />
                <span style={{ marginLeft: '.5rem' }}>{el.context}</span>
              </>
            </MenuItem>
          ))}
        </Menu>
      </div>
    </>
  );
}
