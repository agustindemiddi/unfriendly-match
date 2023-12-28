import { Link } from 'react-router-dom';

import Section from '../UI/Section';
import PlayerIconContainer from '../Matches/PlayerIcon/PlayerIconContainer';

const ContactsSection = ({ contacts }) => {
  return (
    <Section>
      {contacts.length > 0 && (
        <ul>
          {contacts.map((contact) => (
            <li key={contact.id}>
              <Link to={`/${contact.id}`}>
                <PlayerIconContainer image={contact.image} />
              </Link>
              <p>{contact.username}</p>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
};

export default ContactsSection;
