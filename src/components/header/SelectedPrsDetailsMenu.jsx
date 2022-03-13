import React from 'react';

import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import LayersIcon from '@mui/icons-material/Layers';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import LaunchIcon from '@mui/icons-material/Launch';

function SelectedPrsDetailMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    return <>
        <IconButton 
            onClick={handleClick} 
            aria-label='selected pr details'
            size='small'
        >
            <MoreVertIcon 
                color="primary" />
        </IconButton>
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
        >
            <MenuItem onClick={() => {
                handleClose();
                props.onGroupClick()
            }}>
                <ListItemIcon>
                    <LayersIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText>Group</ListItemText>
                <Typography variant="body2" color="text.secondary">
                    ⌘G
                </Typography>
            </MenuItem>
            <MenuItem onClick={() => {
                handleClose();
                props.onOpenClick()
            }}>
                <ListItemIcon>
                    <LaunchIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText>Open</ListItemText>
                <Typography variant="body2" color="text.secondary">
                    ⌘O
                </Typography>
            </MenuItem>
            <MenuItem onClick={() => {
                handleClose();
                props.onCopyClick()
            }}>
                <ListItemIcon>
                    <CopyAllIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
                <Typography variant="body2" color="text.secondary">
                    ⌘C
                </Typography>
            </MenuItem>
        </Menu>
    </>;
}

export default SelectedPrsDetailMenu;