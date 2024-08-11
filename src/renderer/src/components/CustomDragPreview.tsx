import styles from "./CustomDragPreview.module.css";

interface CustomDragPreviewProps {
  monitorProps: any
}

export const CustomDragPreview = (props: CustomDragPreviewProps) => {
  const item = props.monitorProps.item;

  return (
    <div className={styles.root}>
      <div className={styles.label}>{item.text}</div>
    </div>
  );
};
