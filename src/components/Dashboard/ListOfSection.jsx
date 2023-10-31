import { Link } from 'react-router-dom';

import styles from './ListOfSection.module.css';

const DUMMY_IMAGE =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxJNdns8vLpqrBm4VOpORyvS0bh8bjKy9M5-A_t_upDYHFxAn3DwlbhqjbDUkpk2Thock&usqp=CAU';

const ListOfSection = ({ list }) => {
  return (
    <ul className={styles.listContent}>
      {list.map((item) => (
        <li key={item.id}>
          <article className={styles.item}>
            <Link>
              <div className={styles.imageContainer}>
                <img className={styles.image} src={DUMMY_IMAGE} alt="" />
              </div>
              <p className={styles.itemName}>{item.name}</p>
            </Link>
          </article>
        </li>
      ))}
    </ul>
  );
};
export default ListOfSection;
