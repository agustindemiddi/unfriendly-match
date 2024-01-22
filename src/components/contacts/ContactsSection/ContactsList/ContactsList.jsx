import ContactItem from './ContactItem/ContactItem';

import styles from './ContactsList.module.css';

const ContactsList = ({ contacts }) => {
  return (
    <ul>
      {contacts.map((contact) => (
        <li key={contact.id}>
          <ContactItem contact={contact} />
          <p>{contact.displayName}</p>
        </li>
      ))}
    </ul>
  );
};

export default ContactsList;
