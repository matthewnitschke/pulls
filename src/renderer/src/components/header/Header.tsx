import { ErrorOutline, NavigateNext, Search } from "@mui/icons-material";
import { AppBar, Breadcrumbs, CircularProgress, Link, ListItemText, Menu, MenuItem, TextField, Toolbar, Typography } from "@mui/material";
import { setActiveQuery } from "@renderer/redux/active_query_slice";
import { useAppDispatch, useAppSelector } from "@renderer/redux/store";
import { Fragment, useState } from "react";
import SelectedPrsDetailMenu from "./SelectedPrsDetailMenu";
import { setFilter } from "@renderer/redux/filter_slice";

interface HeaderProps {
  onGroupClick: () => void;
}

export default function Header(props: HeaderProps) {
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget as any);
  const handleClose = () => setAnchorEl(null);

  let queries = useAppSelector((state) => state.config.data?.queries);
  let activeQueryIndex = useAppSelector((state) => state.activeQueryIndex);
  let prQueryStatus = useAppSelector((state) => state.prs.status);
  let selectedPrIds = useAppSelector((state) => state.selectedPrs);
  let filterText = useAppSelector((state) => state.filter);

  if (queries == null) return;

  return <Fragment>
    <AppBar
      elevation={0}
      position="fixed"
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
        }}
      >
        <Breadcrumbs separator={<NavigateNext fontSize="small"/>}>
          <Typography
            color="text.primary"
            fontSize={'1.1rem'}
          >PULLS</Typography>
          <Link
            color="inherit"
            underline="hover"
            sx={{ cursor: 'pointer' }}
            onClick={handleClick}
          >
            {queries[activeQueryIndex]?.label}
          </Link>
        </Breadcrumbs>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          sx={{ transform: 'translateY(8px)' }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          {queries.map((query, i) => (
              <MenuItem
                key={query.label}
                sx={{ width: 180 }}
                onClick={() => {
                  dispatch(setActiveQuery(i));
                  handleClose();
                }}
              >
                <ListItemText>{query.label}</ListItemText>
                {i <= 9 && (
                  <Typography variant="body2" color="text.secondary">
                    ⌘{i + 1}
                  </Typography>
                )}
              </MenuItem>
            ))}
        </Menu>

        { selectedPrIds.length >= 2 && <SelectedPrsDetailMenu onGroupClick={props.onGroupClick} /> }

        {prQueryStatus == 'loading' && <CircularProgress size="1rem" sx={{ marginLeft: '.5rem' }} />}
        {prQueryStatus == 'error' && <ErrorOutline sx={{ marginLeft: '.5rem' }} />}
      </Toolbar>
      <TextField
        variant="outlined"
        sx={{
          mx: '.7rem',
          zIndex: 1100,
          mb: '-12px',

          '& .MuiOutlinedInput-root': {
            borderRadius: '2rem',
            backgroundColor: 'background.default',

            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: '1px', // dont increase the width on selection
            },
          },

          '& .MuiOutlinedInput-input': {
            padding: '.15rem 1rem',
            fontWeight: 400,
          },


        }}
        InputProps={{
          endAdornment: <Search fontSize="small" />
        }}
        value={filterText}
        onChange={(e) => dispatch(setFilter(e.target.value))}
      />
    </AppBar>
    <Toolbar />
  </Fragment>

}
