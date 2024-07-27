import { ErrorOutline, NavigateNext } from "@mui/icons-material";
import { AppBar, Breadcrumbs, CircularProgress, Link, ListItemText, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { setActiveQuery } from "@renderer/redux/active_query_slice";
import { useAppDispatch, useAppSelector } from "@renderer/redux/store";
import { Fragment, useState } from "react";

export default function Header(props) {
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  let queries = useAppSelector((state) => state.config.data?.queries);
  let activeQueryIndex = useAppSelector((state) => state.activeQueryIndex);
  let prQueryStatus = useAppSelector((state) => state.prs.status);

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
          <Typography color="text.primary">PULLS</Typography>
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

        {prQueryStatus == 'loading' && <CircularProgress size="1rem" sx={{ marginLeft: '.5rem' }} />}
        {prQueryStatus == 'error' && <ErrorOutline sx={{ marginLeft: '.5rem' }} />}
      </Toolbar>
    </AppBar>
    <Toolbar />

  </Fragment>

}
