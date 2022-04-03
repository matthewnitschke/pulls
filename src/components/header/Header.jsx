import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { setActiveQuery } from '../../redux/root_reducer';

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
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  
  let dispatch = useDispatch();
  let queries = useSelector((state) => state.config.queries);
  let activeQueryIndex = useSelector((state) => state.activeQueryIndex);
  let isPrsQueryRunning = useSelector((state) => state.prs.status == 'loading');
  let selectedItemIds = useSelector(state => state.selectedItemIds);

    return <div className='header'>
        <div className='main-header'>
            <div className='df aic'>
                <Breadcrumbs 
                    aria-label="breadcrumb"
                    separator={<NavigateNextIcon fontSize="small" />}
                >
                    <Typography color="text.primary">PULLS</Typography>
                    {
                        queries.length > 1 &&
                        <Link
                            color="inherit"
                            underline="hover"
                            onClick={handleClick}
                        >
                            {queries[activeQueryIndex].label}
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
                queries.map((query, i) => <MenuItem 
                    key={query.label}
                    onClick={() => {
                        dispatch(setActiveQuery(i))
                        handleClose();
                    }}
                >
                    <ListItemText>{query.label}</ListItemText>
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
                    isPrsQueryRunning &&
                    <CircularProgress size='1rem' style={{ marginLeft: '.5rem' }}/>
                }
            </div>
        </div>
    </div>
}

export default Header;
