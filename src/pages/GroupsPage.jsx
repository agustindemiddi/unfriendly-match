import PageContent from '../components/UI/PageContent';
import Dashboard from '../components/Dashboard/Dashboard';

import DUMMY_BACKEND from '../DUMMY/DUMMY_BACKEND';
const section = [];
section[0] = DUMMY_BACKEND[1];

const GroupsPage = () => {
  return (
    <PageContent title='My Groups'>
      <Dashboard sections={section} />
    </PageContent>
  );
};
export default GroupsPage;
