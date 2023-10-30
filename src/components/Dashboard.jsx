import { Link } from 'react-router-dom';

import {
  PlusCircleFilled,
  SearchOutlined,
  MenuOutlined,
} from '@ant-design/icons';

import styles from './Dashboard.module.css';

const DUMMY_IMAGE =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxJNdns8vLpqrBm4VOpORyvS0bh8bjKy9M5-A_t_upDYHFxAn3DwlbhqjbDUkpk2Thock&usqp=CAU';

const Dashboard = () => {
  return (
    <>
      <h1>DASHBOARD</h1>

      <section>
        <h2>My Tournaments</h2>
        <div className={styles.sectionContent}>
          <article>
            <Link>
              <div className={styles.iconContainer}>
                <PlusCircleFilled style={{ fontSize: '90px' }} />
              </div>
              <p>Create new tournament</p>
            </Link>
          </article>

          <ul className={styles.sectionContent}>
            <article>
              <div className={styles.imageContainer}>
                <img src={DUMMY_IMAGE} alt="" />
              </div>
              <p>Pepito Cup</p>
            </article>
            <article>
              <div className={styles.imageContainer}>
                <img src={DUMMY_IMAGE} alt="" />
              </div>
              <p>Cornalito Cup</p>
            </article>
            <article>
              <div className={styles.imageContainer}>
                <img src={DUMMY_IMAGE} alt="" />
              </div>
              <p>Bowser's Cup</p>
            </article>
          </ul>

          <article>
            <div className={styles.iconContainer}>
              <MenuOutlined style={{ fontSize: '72px' }} />
            </div>
            <p>Show all</p>
          </article>
        </div>
      </section>

      <section>
        <h2>My Groups</h2>
        <div className={styles.sectionContent}>
          <article>
            <div className={styles.iconContainer}>
              <PlusCircleFilled style={{ fontSize: '90px' }} />
            </div>
            <p>Create new group</p>
          </article>

          <ul className={styles.sectionContent}>
            <article>
              <div className={styles.imageContainer}>
                <img src={DUMMY_IMAGE} alt="" />
              </div>
              <p>The Pibes</p>
            </article>
            <article>
              <div className={styles.imageContainer}>
                <img src={DUMMY_IMAGE} alt="" />
              </div>
              <p>The Wolfpack</p>
            </article>
          </ul>

          <article>
            <div className={styles.iconContainer}>
              <MenuOutlined style={{ fontSize: '72px' }} />
            </div>
            <p>Show all</p>
          </article>
        </div>
      </section>

      <section>
        <h2>My Contacts</h2>
        <div className={styles.sectionContent}>
          <article>
            <div className={styles.iconContainer}>
              <SearchOutlined style={{ fontSize: '90px' }} />
            </div>
            <p>Search players</p>
          </article>

          <ul className={styles.sectionContent}>
            <article>
              <div className={styles.imageContainer}>
                <img src={DUMMY_IMAGE} alt="" />
              </div>
              <p>Carlos Maslatón</p>
            </article>
            <article>
              <div className={styles.imageContainer}>
                <img src={DUMMY_IMAGE} alt="" />
              </div>
              <p>Andy Chango</p>
            </article>
            <article>
              <div className={styles.imageContainer}>
                <img src={DUMMY_IMAGE} alt="" />
              </div>
              <p>Pepito Juárez</p>
            </article>
          </ul>

          <article>
            <div className={styles.iconContainer}>
              <MenuOutlined style={{ fontSize: '72px' }} />
            </div>
            <p>Show all</p>
          </article>
        </div>
      </section>
    </>
  );
};
export default Dashboard;
