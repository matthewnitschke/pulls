// Libraries
import React from "react";

import { openUrl } from '../utils.js';

// Components
import PrStatusIndicator from "./utils/PrStatusIndicator";
import ItemActionsMenu from "./ItemActionsMenu";
import { toggleItemSelection } from "../redux/selected_item_ids_slice";
import { useDispatch, useSelector } from "react-redux";
import { selectActiveQuery } from "../redux/selectors.js";

const PullListItem = React.forwardRef((props, ref) => {
  let { filterText } = props;

  let dispatch = useDispatch();
  let isSelected = useSelector(state => state.selectedItemIds.includes(props.id))

  let actions = useSelector(state => {
    let activeQuery = state.config.queries[state.activeQueryIndex]

    return activeQuery.prActions
  })

  let prTitleRewriter = useSelector(state => state.config.prTitleRewriter);

  function _getPrTitle() {
    let name = prTitleRewriter != null
      ? props.name.replace(new RegExp(prTitleRewriter), '')
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
      { (actions?.length ?? 0) > 0 &&
        <div>
          <ItemActionsMenu actions={actions} itemId={props.id} />
        </div>
      }
    </div>
  );
});

export default PullListItem;
