import MainNavigation from '../components/MainNavigation/MainNavigation';
import PageContent from '../components/UI/PageContent';

const ErrorPage = () => {
  return (
    <>
      <MainNavigation />
      <PageContent title='An error occurred!'>
        <p>Something went wrong!</p>
      </PageContent>
    </>
  );
};

export default ErrorPage;
