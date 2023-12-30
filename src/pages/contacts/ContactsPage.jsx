import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';

import ContactsSection from '../../components/contacts/ContactsSection/ContactsSection';

import { getUserAuthCtx } from '../../context/authContext';
import {
  getTournaments,
  getPlayers,
} from '../../utils/firebase/firestore/firestoreActions';
import bouncingBall from '../../assets/bouncing-ball.json';

const ContactsPage = () => {
  const { userPlayerProfile } = getUserAuthCtx();
  const [isLoading, setIsLoading] = useState(true);
  const [userContacts, setUserContacts] = useState([]);
  // const [userTournaments, setUserTournaments] = useState([]);

  useEffect(() => {
    if (userPlayerProfile) {
      const fetchContacts = async () => {
        const userTournamentsIds = await getTournaments(
          userPlayerProfile.tournaments.all
        );
        // setUserTournaments(userTournaments);

        const tournamentPlayersIds = userTournamentsIds.map(
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
    }
  }, [userPlayerProfile]);

  const content = isLoading ? (
    <Lottie animationData={bouncingBall} loop={true} />
  ) : (
    <ContactsSection contacts={userContacts} />
  );

  return content;
};

export default ContactsPage;
