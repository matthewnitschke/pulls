import React from 'react';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

function Header(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return <div className='header'>
        <div className='main-header'>
            <Breadcrumbs 
                aria-label="breadcrumb"
                separator={<NavigateNextIcon fontSize="small" />}
            >
                <Typography color="text.primary">PULLS</Typography>
                {
                    props.queries.length > 1 &&
                    <Link
                        color="inherit"
                        underline="hover"
                        onClick={handleClick}
                    >
                        {props.currentQuery.key}
                    </Link>
                }
            </Breadcrumbs>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{ style: { transform: 'translateY(5px)' } }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                {props.queries.map(query => <MenuItem 
                    onClick={() => {
                        props.onSetQuery(query)
                        handleClose();
                    }}
                >{query.key}</MenuItem>)}
            </Menu>
        </div>
    </div>
}

export default Header;