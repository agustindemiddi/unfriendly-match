import { useState } from 'react';

import Breadcrumbs from './Breadcrumbs/Breadcrumbs';

import styles from './ActionsBar.module.css';

const ActionsBar = ({ actions }) => {
  const [isActionsShown, setIsActionsShown] = useState(false);

  return (
    <nav className={styles.actionBar}>
      <Breadcrumbs />
      {actions?.length > 0 && (
        <button onClick={() => setIsActionsShown((prevState) => !prevState)}>
          {/* Actions <span>▶</span> */}
          Actions
        </button>
      )}
      {isActionsShown && (
        <div className={styles.actionsList}>
          {actions.map((action) => (
            <button key={action.label} onClick={action.onAction}>
              {action.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default ActionsBar;
