import Section from '../../UI/Section/Section';
import ActionsBar from '../../UI/ActionsBar/ActionsBar';
import ContactsList from './ContactsList/ContactsList';

import styles from './ContactsSection.module.css';

const ContactsSection = ({ contacts }) => {
  return (
    <Section>
      <ActionsBar />
      {contacts.length > 0 && <ContactsList contacts={contacts} />}
    </Section>
  );
};

export default ContactsSection;
