import styles from "./CustomDragPreview.module.css";

export const CustomDragPreview = (props: any) => {
  const item = props.monitorProps.item;

  return (
    <div className={styles.root}>
      <div className={styles.label}>{item.text}</div>
    </div>
  );
};
