import { useParams } from 'react-router-dom';

import PageContent from '../components/UI/PageContent';
import ContactItem from '../components/ContactItem';

import DUMMY_BACKEND from '../DUMMY/DUMMY_BACKEND';

const ContactDetailsPage = () => {
  const params = useParams();

  const item = DUMMY_BACKEND[2].list.filter(
    (item) => item.id === params.contactId
  )[0];

  return (
    <PageContent title='ContactDetailsPage'>
      <ContactItem item={item} />
    </PageContent>
  );
};
export default ContactDetailsPage;
