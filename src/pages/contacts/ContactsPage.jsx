import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';

import ContactsSection from '../../components/contacts/ContactsSection/ContactsSection';

import { getUserAuthCtx } from '../../context/authContext';
import { getPlayers } from '../../utils/firebase/firestore/firestoreActions';
import bouncingBall from '../../assets/bouncing-ball.json';

const ContactsPage = () => {
  const { userPlayerProfile, updatedUserTournaments } = getUserAuthCtx();
  const [isLoading, setIsLoading] = useState(true);
  const [userContacts, setUserContacts] = useState([]);

  useEffect(() => {
    if (updatedUserTournaments?.length > 0 && userPlayerProfile) {
      setIsLoading(true);
      const fetchContacts = async () => {
        const tournamentPlayersIds = updatedUserTournaments.all.map(
          (tournament) => tournament.players
        );
        const allContactsIds = Array.from(
          new Set(tournamentPlayersIds.flat())
        ).filter((playerId) => playerId !== userPlayerProfile.id);

        const allContacts = await getPlayers(allContactsIds);
        setUserContacts(allContacts);
        setIsLoading(false);
      };
      fetchContacts();
    } else {
      setIsLoading(false);
    }
  }, [updatedUserTournaments?.all]);

  const content = isLoading ? (
    <Lottie animationData={bouncingBall} loop={true} />
  ) : (
    <ContactsSection contacts={userContacts} />
  );

  return content;
};

export default ContactsPage;
