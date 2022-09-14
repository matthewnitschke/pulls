import React from 'react';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import StatusIcon from './PrStatusIcon';

import { openUrl } from '../../utils.js';

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

  const open = Boolean(anchorEl);

  return (
    <>
      <div aria-haspopup="true" onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
        <StatusIcon state={props.state} />
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handlePopoverClose}
          sx={{
            popover: {
              pointerEvents: 'none'
            },
            paper: {
              popoverContent: {
                pointerEvents: 'auto'
              }
            }
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
