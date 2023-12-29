import styles from './Section.module.css';

const Section = ({ children, className }) => {
  const classes = `${styles.section} ${className || ''}`;
  return <section className={classes}>{children}</section>;
};

export default Section;
