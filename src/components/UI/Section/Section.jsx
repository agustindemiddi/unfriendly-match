import ActionsBar from './ActionsBar/ActionsBar';

import styles from './Section.module.css';

const Section = ({
  children,
  className,
  actions,
  adminActions,
  initialAction,
}) => {
  const classes = `${styles.section} ${className || ''}`;
  return (
    <section className={classes}>
      <ActionsBar
        actions={actions}
        adminActions={adminActions}
        initialAction={initialAction}
      />
      {children}
    </section>
  );
};

export default Section;
