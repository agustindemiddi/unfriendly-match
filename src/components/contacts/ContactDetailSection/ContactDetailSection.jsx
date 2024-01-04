import { Link } from 'react-router-dom';
import { Button } from 'antd';

import Section from '../../UI/Section/Section';

import styles from './ContactDetailSection.module.css';

const ContactDetail = ({ item }) => {
  // armar el fallback de otra manera. este codigo es espantoso
  return (
    <Section noActionsBar>
      {item.username && (
        <>
          <h2>{item.name}</h2>
          <p>description: {item.description}</p>
          <img src={item.image} alt='' />
        </>
      )}
      {!item.username && (
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
