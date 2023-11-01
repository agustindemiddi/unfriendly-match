import PageContent from '../components/UI/PageContent';
import Dashboard from '../components/Dashboard/Dashboard';

import DUMMY_BACKEND from '../DUMMY/DUMMY_BACKEND';

const HomePage = () => {
  return (
    <PageContent title='Dashboard'>
      <Dashboard sections={DUMMY_BACKEND} />
    </PageContent>
  );
};
export default HomePage;
