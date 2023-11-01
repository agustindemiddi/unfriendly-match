import PageContent from '../components/UI/PageContent';
import Dashboard from '../components/Dashboard/Dashboard';

import DUMMY_BACKEND from '../DUMMY/DUMMY_BACKEND';
const section = [];
section[0] = DUMMY_BACKEND[2];

const ContactsPage = () => {
  return (
    <PageContent title='My Contacts'>
      <Dashboard sections={section} />
    </PageContent>
  );
};
export default ContactsPage;
