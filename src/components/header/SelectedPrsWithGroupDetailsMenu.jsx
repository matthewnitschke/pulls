import React from 'react';

import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LayersIcon from '@mui/icons-material/Layers';

function SelectedPrsWithGroupDetailsMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    return <>
        <IconButton onClick={handleClick}>
            <MoreVertIcon color="primary" />
        </IconButton>
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            sx={{
                '& .MuiMenu-paper': {
                    width: 200
                }
            }}
        >
            <MenuItem onClick={() => {
                handleClose();
                props.onAddToGroupClick()
            }}>
                <ListItemIcon>
                    <LayersIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText>Add to Group</ListItemText>
                {/* <Typography variant="body2" color="text.secondary">
                    ⌘G
                </Typography> */}
            </MenuItem>
        </Menu>
    </>;
}

export default SelectedPrsWithGroupDetailsMenu;