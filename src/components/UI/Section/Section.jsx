import styles from './Section.module.css';

const Section = ({ children, row }) => (
  <section className={`${styles.section} ${row ? styles.row : ''}`}>
    {children}
  </section>
);

export default Section;
