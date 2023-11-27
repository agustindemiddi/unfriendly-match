import { Link } from 'react-router-dom';

import DashboardItem from './DashboardItem';

import styles from './Dashboard.module.css';

const Dashboard = ({ list, url }) => {
  return (
    <section key={url}>
      <div className={styles.sectionContent}>
        <ul className={styles.listContent}>
          {list.map(({ id, image, name }) => (
            <li key={id}>
              <Link to={`${url}/${id}`}>
                <DashboardItem id={id} url={url} image={image} label={name} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Dashboard;
