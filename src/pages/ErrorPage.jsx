import MainNavigation from '../components/MainNavigation/MainNavigation';
import Section from '../components/UI/Section';

const ErrorPage = () => {
  return (
    <>
      <header>
        <MainNavigation />
      </header>
      <main>
        <aside>SIDE NAV MENU</aside>
        <Section>
          <h1>An error occurred!</h1>
          <p>Something went wrong!</p>
        </Section>
      </main>
      <footer>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur
        nulla praesentium atque ipsa quasi iste nam harum accusamus obcaecati.
      </footer>
    </>
  );
};

export default ErrorPage;
