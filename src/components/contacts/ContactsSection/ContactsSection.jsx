import Section from '../../UI/Section/Section';
import ContactsList from './ContactsList/ContactsList';

import styles from './ContactsSection.module.css';

const ContactsSection = ({ contacts }) => {
  return (
    <Section noActionsBar>
      {contacts.length > 0 && <ContactsList contacts={contacts} />}
    </Section>
  );
};

export default ContactsSection;
