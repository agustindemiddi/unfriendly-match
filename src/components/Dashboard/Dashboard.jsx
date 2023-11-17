import { Link } from 'react-router-dom';

import DashboardItem from './DashboardItem';

import cupIcon from '../../assets/icons/cup/cup-svgrepo-com.svg';
import groupIcon from '../../assets/icons/team/football-team-people-svgrepo-com.svg';
import searchUserIcon from '../../assets/icons/user-search/user-search-svgrepo-com.svg';
import archiveIcon from '../../assets/icons/archive/archive-2-svgrepo-com.svg';

import styles from './Dashboard.module.css';

const Dashboard = ({ list, url }) => {
  let title = '';
  let label = '';
  let icon = '';

  if (url === '/tournaments') {
    title = 'My tournaments';
    label = 'Create new tournament';
    icon = cupIcon;
  }

  if (url === '/groups') {
    title = 'My groups';
    label = 'Create new group';
    icon = groupIcon;
  }

  if (url === '/contacts') {
    title = 'My contacts';
    label = 'Create new player';
    icon = searchUserIcon;
  }

  return (
    <section key={url}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.sectionContent}>
      <Link to={`${url}/new`}>
          <DashboardItem url={url} image={icon} label={label} />
        </Link>
        <ul className={styles.listContent}>
          {list.map(({ id, image, name }) => (
            <li key={id}>
              <Link to={`${url}/${id}`}>
                <DashboardItem id={id} url={url} image={image} label={name} />
              </Link>
            </li>
          ))}
        </ul>
        <Link to={url}>
          <DashboardItem url={url} image={archiveIcon} label='Show all' />
        </Link>
      </div>
    </section>
  );
};

export default Dashboard;
