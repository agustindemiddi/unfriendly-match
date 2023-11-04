import { collection, getDocs } from 'firebase/firestore';

import PageContent from '../components/UI/PageContent';
import Dashboard from '../components/Dashboard/Dashboard';

import db from '../utils/firebaseConfig';

const querySnapshot = await getDocs(collection(db, 'users'));
querySnapshot.forEach((doc) => {
  console.log(`${doc.id} => ${doc.data().name}`);
});

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
