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
import { selectActiveRootQuery } from "@renderer/redux/selectors";

export default function PrList() {
  let dispatch = useAppDispatch();
  let activeRootQuery = useAppSelector((state) => state.activeRootQuery);
  let structure = useAppSelector((state) => state.structure[activeRootQuery]);

  let filterText = useAppSelector((state) => state.filter);
  let prs = useAppSelector((state) => {
    let query = selectActiveRootQuery(state);
    if (query == null) return null;
    return state.prs.data[query];
  });

  useHotkeys("Ctrl+r", () => {
    dispatch(fetchPrs(activeRootQuery))
  });

  if (structure == null || activeRootQuery == null) return null;

  let filteredStructure = structure.filter((node) => {
    if (filterText == '' || prs == null) return true;

    if (node.droppable) {
      let nodeChildren = structure.filter((n) => n.parent == node.id);
      return nodeChildren.some((n) => {
        if (prs[n.id] == null) return false;
        return prs[n.id].name.toLowerCase().includes(filterText.toLowerCase());
      });
    }

    if (prs[node.id] == null) return false;

    return prs[node.id].name.toLowerCase().includes(filterText.toLowerCase());
  });

  const handleDrop = (newTree: NodeModel[]) => {
    dispatch(updateStructure({
      query: activeRootQuery,
      nodes: newTree
    }));
  };

  return <Tree
    tree={filteredStructure}
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
      if (dragSource?.parent === dropTargetId) {
        return true;
      }
    }}
    dropTargetOffset={5}
    placeholderRender={(_, { depth }) => (
      <Placeholder depth={depth} />
    )}
    onDrop={handleDrop}
  />;
}
