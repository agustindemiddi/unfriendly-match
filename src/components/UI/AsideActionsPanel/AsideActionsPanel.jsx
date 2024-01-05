import ActionButton from './ActionButton/ActionButton';

import styles from './AsideActionsPanel.module.css';

const AsideActionsPanel = ({ initialAction, adminActions, actions }) => {
  const hasInitialAction =
    initialAction && Object.keys(initialAction).length > 0;
  const hasAdminAction = adminActions?.length > 0;
  const hasUserAction = actions?.length > 0;
  const hasAction = hasInitialAction || hasAdminAction || hasUserAction;

  return (
    <>
      {hasAction && (
        <aside className={styles.asideActionsPanel}>
          {hasInitialAction ? (
            <div>
              <ActionButton action={initialAction} />
            </div>
          ) : (
            <>
              {hasAdminAction && (
                <div className={styles.adminActions}>
                  {adminActions.map((action) => (
                    <ActionButton key={action.label} action={action} />
                  ))}
                </div>
              )}
              {hasUserAction && (
                <div>
                  {actions.map((action) => (
                    <ActionButton key={action.label} action={action} />
                  ))}
                </div>
              )}
            </>
          )}
        </aside>
      )}
    </>
  );
};

export default AsideActionsPanel;
