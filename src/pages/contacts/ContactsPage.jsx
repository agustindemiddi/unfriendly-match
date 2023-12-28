import { useState, useEffect } from 'react';

import ContactsSection from '../../components/Contacts/ContactsSection';

import { getUserAuthCtx } from '../../context/authContext';
import {
  getTournaments,
  getPlayers,
} from '../../utils/firebase/firestore/firestoreActions';

const ContactsPage = () => {
  const { userPlayerProfile } = getUserAuthCtx();
  const [userContacts, setUserContacts] = useState([]);
  // const [userTournaments, setUserTournaments] = useState([]);

  useEffect(() => {
    if (userPlayerProfile) {
      const fetchContacts = async () => {
        const userTournaments = await getTournaments(
          userPlayerProfile.tournaments.all
        );
        // setUserTournaments(userTournaments);

        const tournamentPlayersIds = userTournaments.map(
          (tournament) => tournament.players
        );
        const allContactsIds = Array.from(
          new Set(tournamentPlayersIds.flat())
        ).filter((playerId) => playerId !== userPlayerProfile.id);

        const allContacts = await getPlayers(allContactsIds);
        setUserContacts(allContacts);
      };
      fetchContacts();
    }
  }, [userPlayerProfile]);

  return <ContactsSection contacts={userContacts} />;
};

export default ContactsPage;
