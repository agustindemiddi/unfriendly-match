import Lottie from 'lottie-react';

import ContactsSection from '../../components/contacts/ContactsSection/ContactsSection';

import { getUserAuthCtx } from '../../context/authContext';

import bouncingBall from '../../assets/bouncing-ball.json';

const ContactsPage = () => {
  const { userContacts } = getUserAuthCtx();

  return <>{userContacts && <ContactsSection contacts={userContacts} />}</>;
};

export default ContactsPage;
