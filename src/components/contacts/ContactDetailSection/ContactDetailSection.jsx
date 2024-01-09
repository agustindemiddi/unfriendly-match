import { Link } from 'react-router-dom';
import { Button } from 'antd';

import Section from '../../UI/Section/Section';

import styles from './ContactDetailSection.module.css';

const ContactDetail = ({ player }) => {
  // armar el fallback de otra manera. este codigo es espantoso
  return (
    <Section>
      {player.username && (
        <>
          <h2>{player.name}</h2>
          <p>description: {player.description}</p>
          <img src={player.image} alt='' />
        </>
      )}
      {!player.username && (
        <>
          <p>Player not found!</p>
          <Button>
            <Link to='..' relative='path'>
              Volver
            </Link>
          </Button>
        </>
      )}
    </Section>
  );
};

export default ContactDetail;
