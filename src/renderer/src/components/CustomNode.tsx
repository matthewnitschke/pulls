import Typography from "@mui/material/Typography";
import StatusIcon from "./utils/PrStatusIcon";
import { useAppDispatch, useAppSelector } from "@renderer/redux/store";
import { Box, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { togglePrSelected } from "@renderer/redux/selected_prs_slice";
import { selectActiveQuery } from "@renderer/redux/selectors";
import openUrls from "@renderer/utils/open_url";

interface CustomNodeProps {
  node: any;
  depth: number;
}

export const CustomNode = (props: CustomNodeProps) => {
  const indent = props.depth * 35;

  let dispatch = useAppDispatch();

  let filterText = useAppSelector((state) => state.filter);

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
    <Box sx={{ marginLeft: `${indent}px`}}>
      <ListItem
        sx={{
          borderBottom: 'solid 1px #373e47',

          backgroundColor: isSelected ? '#2d323a' : 'inherit',
          '&:hover': {
            cursor: 'pointer',
            backgroundColor: '#2d323a',
          }
        }}
        onClick={handleClick}
      >
        <ListItemIcon>
          <StatusIcon state={pr.status} />
        </ListItemIcon>

        <ListItemText>
          <Typography
            component="span"
            sx={{mr: 1}}
            color="text.secondary"
          >{pr.repo}</Typography>

          <Title name={pr.name} filterText={filterText} />

        </ListItemText>
      </ListItem>
    </Box>
  );
};

function Title(props: { name: string, filterText: string }) {
  let name = props.name;

  if (props.filterText != '') {
    let matchStart = name.toLowerCase().indexOf(props.filterText.toLowerCase());

    // sanity check to make sure the filter text is in the name
    if (matchStart <= -1) return name;

    let prefix = name.substring(0, matchStart);
    let match = name.substring(matchStart, matchStart + props.filterText.length);
    let suffix = name.substring(matchStart + props.filterText.length);

    return (
      <Typography
        component="span"
      >
        {prefix}
        <mark>{match}</mark>
        {suffix}
      </Typography>
    );
  }

  return name;
}
