import { Link } from 'react-router-dom';

import styles from './ActionItem.module.css';

const ActionItem = ({ label, icon: Icon, style }) => {
  return (
    <article className={styles.item}>
      <Link>
        <div className={styles.iconContainer}>
          <Icon style={style} />
        </div>
        <p className={styles.itemName}>{label}</p>
      </Link>
    </article>
  );
};
export default ActionItem;
