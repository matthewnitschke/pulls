// Libraries
import React from "react";

const settings = require("./settings/settings-utils.js");

import { openUrl } from '../utils.js';

// Components
import PrStatusIndicator from "./utils/PrStatusIndicator";
import { toggleItemSelection } from "../redux/selected_item_ids_slice";
import { useDispatch, useSelector } from "react-redux";

const PullListItem = React.forwardRef((props, ref) => {
  let { filterText } = props;

  let dispatch = useDispatch();
  let isSelected = useSelector(state => state.selectedItemIds.includes(props.id))

  function _getPrTitle() {
    let name = settings.has("prTitleRewriter")
      ? props.name.replace(new RegExp(settings.get("prTitleRewriter")), "")
      : props.name;

    if (filterText != "" || filterText != null) {
      let matchStart = name.toLowerCase().indexOf(filterText.toLowerCase());

      // sanity check to make sure the filter text is in the name
      if (matchStart <= -1) return name;

      let prefix = name.substring(0, matchStart);
      let match = name.substring(matchStart, matchStart + filterText.length);
      let suffix = name.substring(matchStart + filterText.length);

      return (
        <>
          {prefix}
          <mark>{match}</mark>
          {suffix}
        </>
      );
    }

    return name;
  }

  function _handleClick(e) {
    if (e?.metaKey || e?.shiftKey) {
      dispatch(toggleItemSelection(props.id));
    } else {
      openUrl(props.url);
    }
  }

  return (
    <div
      ref={ref}
      className={`pr-list-item ${isSelected ? "selected" : ""} ${
        props.isHovered ? "hovered" : ""
      } ${props.className}`}
      onClick={_handleClick}
      style={props.style}
      role="listitem"
      onMouseOver={props.onMouseOver}
    >
      <PrStatusIndicator
        state={props.prStatus}
        contexts={props.prStatusContexts}
        isMerged={props.isClosed}
      />
      <div className={`pr-list-item__text ${props.isClosed ? "merged" : ""}`}>
        <span className="pr-list-item__repo-name">{props.repo}</span>
        {_getPrTitle()}
      </div>
    </div>
  );
});

export default PullListItem;
