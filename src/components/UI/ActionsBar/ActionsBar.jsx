import { useState } from 'react';

import Breadcrumbs from './Breadcrumbs/Breadcrumbs';

import styles from './ActionsBar.module.css';

const ActionsBar = ({ initialAction, actions, adminActions }) => {
  const [isActionsShown, setIsActionsShown] = useState(false);
  const isActions = actions?.length > 0 || adminActions?.length > 0;

  const handleInitialAction = () => {
    initialAction.onAction();
    setIsActionsShown(false);
  };

  return (
    <>
      <nav className={styles.actionBar}>
        <Breadcrumbs />
        {initialAction && Object.keys(initialAction)?.length > 0 && (
          <button
            style={{ backgroundColor: initialAction.color }}
            onClick={handleInitialAction}>
            {initialAction.label}
          </button>
        )}
        {isActions && (
          <button onClick={() => setIsActionsShown((prevState) => !prevState)}>
            Actions {isActionsShown ? <span>&lt;</span> : <span>&gt;</span>}
          </button>
        )}
      </nav>
      {isActionsShown && (
        <>
          <div className={styles.actionsList}>
            {actions?.length > 0 &&
              actions.map((action) => (
                <button
                  key={action.label}
                  style={{ backgroundColor: action.color }}
                  onClick={action.onAction}>
                  {action.label}
                </button>
              ))}
            {adminActions?.length > 0 && (
              <div className={styles.adminActions}>
                <span>--- ADMIN ACTIONS ---</span>
                {adminActions.map((action) => (
                  <button
                    key={action.label}
                    style={{ backgroundColor: action.color }}
                    onClick={action.onAction}>
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default ActionsBar;
