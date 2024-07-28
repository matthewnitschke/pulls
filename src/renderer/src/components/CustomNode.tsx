import Typography from "@mui/material/Typography";
import StatusIcon from "./utils/PrStatusIcon";
import { useAppDispatch, useAppSelector } from "@renderer/redux/store";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { togglePrSelected } from "@renderer/redux/selected_prs_slice";
import { selectActiveQuery } from "@renderer/redux/selectors";
import openUrls from "@renderer/utils/open_url";

interface CustomNodeProps {
  node: any;
  depth: number;
}

export const CustomNode = (props: CustomNodeProps) => {
  const indent = props.depth * 30;

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

  if (pr == null) return null;

  const handleClick = (e: any) => {
    if (e.metaKey) {
      dispatch(togglePrSelected(props.node.id));
    } else {
      openUrls([pr.url]);
    }
  };

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
          <StatusIcon state={pr.status} />
        </ListItemIcon>

        <ListItemText>
          <Typography
            component="span"
            fontWeight={500}
            sx={{mr: 1}}
            color="text.secondary"
          >{pr.repo}</Typography>
          {pr.name}
        </ListItemText>
      </ListItemButton>
    </ListItem>
  );
};
