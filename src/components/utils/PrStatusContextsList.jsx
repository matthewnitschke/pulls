import React from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";

import { openUrl } from "../../utils.js";
import StatusIcon from "./PrStatusIcon.jsx";

export default function PrStatusContextsList(props) {
  return (
    <List>
      {props.contexts?.map((el, i) => (
        <ListItem
          key={i}
          disablePadding
          onClick={(e) => {
            e.stopPropagation();
            openUrl(el.targetUrl);
          }}
        >
          <ListItemButton>
            <StatusIcon state={el.state} />
            <span style={{ marginLeft: ".5rem" }}>{el.context}</span>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
