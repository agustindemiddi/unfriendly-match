import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import ContactDetailSection from '../../components/contacts/ContactDetailSection/ContactDetailSection';

import { getPlayer } from '../../utils/firebase/firestore/firestoreActions';

const ContactDetailPage = () => {
  const { playerId } = useParams();
  const [player, setPlayer] = useState({});

  useEffect(() => {
    const fetchPlayer = async () => {
      const fetchedPlayer = await getPlayer(playerId);
      setPlayer(fetchedPlayer);
    };
    fetchPlayer();
  }, []);

  return <>{player && <ContactDetailSection player={player} />}</>;
};

export default ContactDetailPage;
