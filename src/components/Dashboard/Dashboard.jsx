import { Link } from 'react-router-dom';

import {
  PlusCircleFilled,
  SearchOutlined,
  MenuOutlined,
} from '@ant-design/icons';

import ActionItem from './ActionItem';

import styles from './Dashboard.module.css';

const Dashboard = ({ list, urlBase }) => {
  let title = '';
  let label = '';
  let icon = {};
  if (urlBase === '/tournaments') {
    title = 'My tournaments';
    label = 'Create new tournament';
    icon = PlusCircleFilled;
  }

  if (urlBase === '/groups') {
    title = 'My groups';
    label = 'Create new group';
    icon = PlusCircleFilled;
  }

  if (urlBase === '/contacts') {
    title = 'My contacts';
    label = 'Search players';
    icon = SearchOutlined;
  }

  return (
      <section key={urlBase}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <div className={styles.sectionContent}>
          <ActionItem label={label} icon={icon} style={{ fontSize: '90px' }} />
          <ul className={styles.listContent}>
            {list.map((item) => (
              <li key={item.id}>
                <article className={styles.item}>
                  <Link to={`${urlBase}/${item.id}`}>
                    <div className={styles.imageContainer}>
                      <img className={styles.image} src={item.image} alt='' />
                    </div>
                    <p className={styles.itemName}>{item.name}</p>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
          <ActionItem
            label='Show all'
            icon={MenuOutlined}
            style={{ fontSize: '72px' }}
          />
        </div>
      </section>
  );
};

export default Dashboard;
