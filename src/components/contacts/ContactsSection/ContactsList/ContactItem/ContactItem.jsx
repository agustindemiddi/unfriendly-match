import { Link } from 'react-router-dom';

import PlayerIconContainer from '../../../../PlayerIcon/PlayerIconContainer';

import styles from './ContactItem.module.css';

const ContactItem = ({ contact }) => {
  return (
    <Link to={`/${contact.id}`}>
      <PlayerIconContainer image={contact.image} />
    </Link>
  );
};

export default ContactItem;
