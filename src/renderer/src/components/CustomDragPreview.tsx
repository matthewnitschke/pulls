import styles from "./CustomDragPreview.module.css";
import { TypeIcon } from "./TypeIcon";

export const CustomDragPreview = (props) => {
  const item = props.monitorProps.item;

  return (
    <div className={styles.root}>
      <div className={styles.icon}>
        <TypeIcon
          droppable={item.droppable || false}
          fileType={item?.data?.fileType}
        />
      </div>
      <div className={styles.label}>{item.text}</div>
    </div>
  );
};
