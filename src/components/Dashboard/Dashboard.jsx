import {
  PlusCircleFilled,
  SearchOutlined,
  MenuOutlined,
} from '@ant-design/icons';

import ActionItem from './ActionItem';
import ListOfSection from './ListOfSection';

import styles from './Dashboard.module.css';

const labels = ['Create new tournament', 'Create new group', 'Search players'];
const icons = [PlusCircleFilled, PlusCircleFilled, SearchOutlined];

const Dashboard = ({ sections }) => {
  return (
    <>
      {sections.map((section, index) => (
        <section key={section.id}>
          <h2 className={styles.sectionTitle}>{section.title}</h2>
          <div className={styles.sectionContent}>
            <ActionItem
              label={labels[index]}
              icon={icons[index]}
              style={{ fontSize: '90px' }}
            />
            <ListOfSection list={section.list} />
            <ActionItem
              label='Show all'
              icon={MenuOutlined}
              style={{ fontSize: '72px' }}
            />
          </div>
        </section>
      ))}
    </>
  );
};
export default Dashboard;
