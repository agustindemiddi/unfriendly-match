import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import ContactDetailSection from '../../components/contacts/ContactDetailSection/ContactDetailSection';

import { getUserAuthCtx } from '../../context/authContext';
import { getPlayer } from '../../utils/firebase/firestore/firestoreActions';
import LoadingBouncingSoccerBall from '../../components/UI/LoadingBouncingSoccerBall/LoadingBouncingSoccerBall';

const ContactDetailPage = () => {
  const { playerId } = useParams();
  const { userPlayerProfile, userContacts } = getUserAuthCtx();
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    if (!userContacts?.find((player) => player.id === playerId)) {
      const fetchPlayer = async () => {
        const fetchedPlayer = await getPlayer(playerId);
        setPlayer(fetchedPlayer);
      };
      fetchPlayer();
    }
  }, []);

  let contact;
  if (userPlayerProfile?.id === playerId) {
    contact = userPlayerProfile;
  } else {
    contact = userContacts?.find((player) => player.id === playerId);
  }

  let isLoading = true;
  if (contact || player) isLoading = false;

  // missing fallback if !player.isPublic

  return (
    <>
      {isLoading ? (
        <LoadingBouncingSoccerBall />
      ) : (
        <ContactDetailSection player={contact || player} />
      )}
    </>
  );
};

export default ContactDetailPage;
