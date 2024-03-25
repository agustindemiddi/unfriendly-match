import ContactsSection from '../../components/contacts/ContactsSection/ContactsSection';

import { getUserAuthCtx } from '../../context/authContext';
import LoadingBouncingSoccerBall from '../../components/UI/LoadingBouncingSoccerBall/LoadingBouncingSoccerBall';

const ContactsPage = () => {
  const { updatedUserContacts } = getUserAuthCtx();

  return (
    <>
      {updatedUserContacts.length > 0 ? (
        <ContactsSection contacts={updatedUserContacts} />
      ) : (
        <LoadingBouncingSoccerBall />
      )}
    </>
  );
};

export default ContactsPage;
