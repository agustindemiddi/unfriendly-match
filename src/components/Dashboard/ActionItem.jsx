import { Link } from 'react-router-dom';

import styles from './ActionItem.module.css';

const ActionItem = ({ url, icon, label }) => {
  return (
    <Link to={url}>
      <article className={styles.item}>
        <div className={styles.iconContainer}>
          <img className={styles.icon} src={icon} />
        </div>
        <p className={styles.itemName}>{label}</p>
      </article>
    </Link>
  );
};

export default ActionItem;
