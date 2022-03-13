import React from 'react';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SelectedPrsDetailMenu from './SelectedPrsDetailsMenu';
import CircularProgress from '@mui/material/CircularProgress';
import { ListItemText } from '@mui/material';

function Header(props) {
    let selectedItemIds = props.selectedItemIds ?? [];

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return <div className='header'>
        <div className='main-header'>
            <div className='df aic'>
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

            </div>

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
                {
                props.queries.map((query, i) => <MenuItem 
                    key={query.key}
                    onClick={() => {
                        props.onSetQuery(query)
                        handleClose();
                    }}
                >
                    <ListItemText>{query.key}</ListItemText>
                    {
                        i <= 9 &&
                        <Typography variant="body2" color="text.secondary">⌘{i+1}</Typography>
                    }
                </MenuItem>)
                }
            </Menu>
            
            <div className='df aic'>
                
                <div style={{visibility: selectedItemIds.length > 0 ? 'visible' : 'hidden'}}>
                    <SelectedPrsDetailMenu 
                        onGroupClick={props.onGroupSelectedPrs}
                        onOpenClick={props.onOpenSelectedPrs}
                        onCopyClick={props.onCopySelectedPrs} />
                </div>
                
                {
                    props.isQueryRunning &&
                    <CircularProgress size='1rem' style={{ marginLeft: '.5rem' }}/>
                }
            </div>
        </div>
    </div>
}

export default Header;