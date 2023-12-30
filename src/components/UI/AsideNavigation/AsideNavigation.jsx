import { NavLink, useParams } from 'react-router-dom';

import styles from './AsideNavigation.module.css';

const sections = [
  { label: 'Main', url: '/' },
  { label: 'Tournaments', url: '/tournaments' },
  { label: 'Contacts', url: '/contacts' },
];

const AsideNavigation = () => {
  const { tournamentId, matchId } = useParams();

  console.log(tournamentId);

  return (
    <nav className={styles.asideNav}>
      <ul>
        {sections.map((section) => (
          <li key={section.label}>
            <NavLink
              className={({ isActive }) => (isActive ? styles.activeLink : '')}
              to={section.url}>
              {section.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AsideNavigation;
