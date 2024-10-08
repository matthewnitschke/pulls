import { Link, ListItemText, Menu, MenuItem, Typography } from "@mui/material";
import { setActiveQuery } from "@renderer/redux/active_query_slice";
import { useAppDispatch, useAppSelector } from "@renderer/redux/store";
import { useState } from "react";

export default function SelectQueryLink() {
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget as any);
  const handleClose = () => setAnchorEl(null);

  let queries = useAppSelector((state) => state.config.data?.queries);
  let activeQueryIndex = useAppSelector((state) => state.activeQueryIndex);

  if (queries == null) return;


  return <>
    <Link
      color="inherit"
      underline="hover"
      sx={{ cursor: 'pointer' }}
      onClick={handleClick}
    >
      {queries[activeQueryIndex]?.label}
    </Link>

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
  </>
}
