import ContactsSection from '../../components/contacts/ContactsSection/ContactsSection';

import { getUserAuthCtx } from '../../context/authContext';

import LoadingBouncingSoccerBall from '../../components/UI/LoadingBouncingSoccerBall/LoadingBouncingSoccerBall';

const ContactsPage = () => {
  const { userContacts } = getUserAuthCtx();

  return (
    <>
      {userContacts.length > 0 ? (
        <ContactsSection contacts={userContacts} />
      ) : (
        <LoadingBouncingSoccerBall />
      )}
    </>
  );
};

export default ContactsPage;
