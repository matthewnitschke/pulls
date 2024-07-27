import Typography from "@mui/material/Typography";
import { ChevronRight } from "@mui/icons-material";
import StatusIcon from "./utils/PrStatusIcon";
import { useAppDispatch, useAppSelector } from "@renderer/redux/store";
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from "@mui/material";
import { togglePrSelected } from "@renderer/redux/selected_prs_slice";
import { Fragment } from "react/jsx-runtime";
import { selectActiveQuery } from "@renderer/redux/selectors";

export const CustomNode = (props) => {
  const indent = props.depth * 30;
  console.log(':: CustomNode', props.node.id);

  let dispatch = useAppDispatch();

  let pr = useAppSelector((state) => {
    if (props.node.id == null) return null;

    let query = selectActiveQuery(state);
    if (query == null) return null;

    if (state.prs.data[query] == null) return null;

    return state.prs.data[query][props.node.id];
  })

  let isSelected = useAppSelector((state) => {
    if (props.node.id == null) return false;
    return state.selectedPrs.includes(props.node.id);
  });

  const handleClick = (e) => {
    if (e.metaKey) {
      dispatch(togglePrSelected(props.node.id));
    } else {
      // open the pr in the browser
    }
  };

  if (pr == null) return null;

  return (
    <ListItem
      style={{ paddingLeft: indent }}
      disablePadding
      sx={{ borderBottom: 'solid 1px #373e47' }}
    >
      <ListItemButton
        selected={isSelected}
        onClick={handleClick}
      >
        <ListItemIcon>

          <StatusIcon state={pr?.status} />
        </ListItemIcon>

        <ListItemText>
          <Typography component="span" sx={{mr: 1}} color="text.secondary">{pr?.repo}</Typography>
          {pr?.name}
        </ListItemText>
      </ListItemButton>
    </ListItem>
  );
};
