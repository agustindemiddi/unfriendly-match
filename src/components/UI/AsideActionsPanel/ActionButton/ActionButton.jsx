import styles from './ActionButton.module.css';

const ActionButton = ({ action }) => {
  return (
    <button
      className={`${styles.actionButton} ${
        action.color === 'greenish'
          ? styles.greenish
          : action.color === 'redish'
          ? styles.redish
          : ''
      }`}
      onClick={action.onAction}>
      {action.label}
    </button>
  );
};

export default ActionButton;
