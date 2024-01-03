import { Link, useLocation } from 'react-router-dom';

import styles from './Breadcrumbs.module.css';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname
    .split('/')
    .filter((segment) => segment !== '');

  return (
    <div className={styles.breadcrumbs}>
      <span>
        <Link to='/'>Main</Link>
        {pathSegments.length > 0 && ' / '}
      </span>
      {pathSegments.map((segment, index) => (
        <span key={segment}>
          {index < pathSegments.length - 1 ? (
            <Link to={`/${pathSegments.slice(0, index + 1).join('/')}`}>
              {segment}
            </Link>
          ) : (
            segment
          )}
          {index < pathSegments.length - 1 && ' / '}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumbs;
