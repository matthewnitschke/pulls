import React, { useRef } from "react";

import useHotkeys from "../hooks/useHotkeys.js";

function FilterInput(props) {
  const filterInputRef = useRef(null);

  useHotkeys("command+l", () => filterInputRef.current.focus());

  return (
    <div className="filter-prs-input-anchor">
      <div className="filter-prs-input-wrapper">
        <input
          type="text"
          ref={filterInputRef}
          className="filter-prs-input"
          value={props.filterText}
          onChange={(e) => props.onChange(e.target.value)}
          onKeyDown={props.onKeyDown}
        />

        <i className="fas fa-search"></i>
      </div>
    </div>
  );
}

export default FilterInput;
