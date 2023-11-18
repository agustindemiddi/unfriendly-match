import styles from './DashboardItem.module.css';

const DashboardItem = ({ image, label }) => {
  return (
    <article className={styles.item}>
      <div className={styles.imageContainer}>
        <img className={styles.image} src={image} alt='' />
      </div>
      <p className={styles.itemName}>{label}</p>
    </article>
  );
};

export default DashboardItem;
