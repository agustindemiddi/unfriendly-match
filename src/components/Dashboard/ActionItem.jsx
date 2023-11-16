import { Link } from 'react-router-dom';

import styles from './ActionItem.module.css';

const ActionItem = ({ url, icon, label }) => {
  return (
    <article className={styles.item}>
      <Link to={url}>
        <div className={styles.iconContainer}>
          <img className={styles.icon} src={icon} />
        </div>
        <p className={styles.itemName}>{label}</p>
      </Link>
    </article>
  );
};

export default ActionItem;
