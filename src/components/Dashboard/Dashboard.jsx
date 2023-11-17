import { Link } from 'react-router-dom';

import ActionItem from './ActionItem';

import cupIcon from '../../assets/icons/cup/cup-svgrepo-com.svg';
import groupIcon from '../../assets/icons/team/football-team-people-svgrepo-com.svg';
import searchUserIcon from '../../assets/icons/user-search/user-search-svgrepo-com.svg';
import archiveIcon from '../../assets/icons/archive/archive-2-svgrepo-com.svg';

import styles from './Dashboard.module.css';

const Dashboard = ({ list, urlBase }) => {
  let title = '';
  let label = '';
  let icon = '';

  if (urlBase === '/tournaments') {
    title = 'My tournaments';
    label = 'Create new tournament';
    icon = cupIcon;
  }

  if (urlBase === '/groups') {
    title = 'My groups';
    label = 'Create new group';
    icon = groupIcon;
  }

  if (urlBase === '/contacts') {
    title = 'My contacts';
    label = 'Search players';
    icon = searchUserIcon;
  }

  return (
    <section key={urlBase}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.sectionContent}>
        <ActionItem label={label} icon={icon} />
        <ul className={styles.listContent}>
          {list.map((item) => (
            <li key={item.id}>
              <Link to={`${urlBase}/${item.id}`}>
                <article className={styles.item}>
                  <div className={styles.imageContainer}>
                    <img className={styles.image} src={item.image} alt='' />
                  </div>
                  <p className={styles.itemName}>{item.name}</p>
                </article>
              </Link>
            </li>
          ))}
        </ul>
        <ActionItem url={urlBase} icon={archiveIcon} label='Show all' />
      </div>
    </section>
  );
};

export default Dashboard;
