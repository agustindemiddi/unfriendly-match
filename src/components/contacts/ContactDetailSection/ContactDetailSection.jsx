import { Link } from 'react-router-dom';
import { Button } from 'antd';

import Section from '../../UI/Section/Section';

import styles from './ContactDetailSection.module.css';

const ContactDetail = ({ player }) => {
  // armar el fallback de otra manera. este codigo es espantoso
  return (
    <Section>
      {player.displayName && (
        <>
          <h2>name: {player.displayName}</h2>
          <p>id: {player.id}</p>
          <img className={styles.image} src={player.image} alt='' />
          <button onClick={() => console.log(player)}>LOG PLAYER DATA</button>
        </>
      )}
      {!player.displayName && (
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
