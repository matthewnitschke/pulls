import { NodeModel, Tree } from "@minoru/react-dnd-treeview";
import { CustomNode } from "./CustomNode";
import { CustomDragPreview } from "./CustomDragPreview";
import styles from "./App.module.css";
import { Placeholder } from "./Placeholder";
import { useAppDispatch, useAppSelector } from "@renderer/redux/store";
import { Box } from "@mui/material";
import { updateStructure } from "@renderer/redux/structure_slice";
import useHotkeys from "@reecelucas/react-use-hotkeys";
import { fetchPrs } from "@renderer/redux/prs_slice";
import { FolderNode } from "./FolderNode";
import { selectActiveQuery } from "@renderer/redux/selectors";

export default function PrList() {
  let dispatch = useAppDispatch();
  let queryIndex = useAppSelector((state) => state.activeQueryIndex);

  let query = useAppSelector(selectActiveQuery);
  let structure = useAppSelector((state) => {
    if (state.config.data.queries.length == 0) return null;
    let query = state.config.data.queries[state.activeQueryIndex].query;
    return state.structure[query];
  });

  useHotkeys("Ctrl+r", () => {
    dispatch(fetchPrs(queryIndex))
  });

  if (structure == null || query == null) return null;

  const handleDrop = (newTree: NodeModel[]) => {
    dispatch(updateStructure({
      query,
      nodes: newTree
    }));
  };

  return <Tree
    tree={structure}
    rootId={0}
    listItemComponent={Box}
    render={(node, { depth, isOpen, onToggle }) => {
      if (node.droppable) {
        return <FolderNode
          node={node}
          depth={depth}
          isOpen={isOpen}
          onToggle={onToggle}
        />
      }

      return (
        <CustomNode
          node={node}
          depth={depth} />
      );
    }}
    dragPreviewRender={(monitorProps) => (
      <CustomDragPreview monitorProps={monitorProps} />
    )}
    classes={{
      root: styles.treeRoot,
      draggingSource: styles.draggingSource,
      placeholder: styles.placeholderContainer,
    }}
    sort={false}
    insertDroppableFirst={false}
    canDrop={(_, { dragSource, dropTargetId }) => {
      return dragSource?.parent === dropTargetId;
    }}
    dropTargetOffset={5}
    placeholderRender={(_, { depth }) => (
      <Placeholder depth={depth} />
    )}
    onDrop={handleDrop}
  />;
}
