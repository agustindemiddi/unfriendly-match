import MainNavigation from '../components/UI/MainNavigation/MainNavigation';
import Section from '../components/UI/Section/Section';

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
    </>
  );
};

export default ErrorPage;
