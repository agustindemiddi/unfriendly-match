import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  query,
  collection,
  where,
  documentId,
  getDocs,
} from 'firebase/firestore';

import Section from '../../components/UI/Section';
import PlayerIcon from '../../components/matches/PlayerIcon/PlayerIcon';

import db from '../../utils/firebase/firebaseConfig';
import { getUserAuthCtx } from '../../context/AuthContext';

const ContactsPage = () => {
  const { userPlayerProfile } = getUserAuthCtx();
  const [userContacts, setUserContacts] = useState([]);

  useEffect(() => {
    if (userPlayerProfile) {
      const fetchData = async () => {
        const qT = query(
          collection(db, 'tournaments'),
          where(documentId(), 'in', userPlayerProfile.tournaments)
        );
        const querySnapshotT = await getDocs(qT);

        const userTournamentsArray = [];
        querySnapshotT.forEach((doc) => {
          const tournament = { ...doc.data(), id: doc.id };
          userTournamentsArray.push(tournament);
        });

        const allContactsIds = Array.from(
          new Set(
            userTournamentsArray.flatMap((tournament) => tournament.players)
          )
        ).filter((playerId) => playerId !== userPlayerProfile.id);

        const qP = query(
          collection(db, 'players'),
          where(documentId(), 'in', allContactsIds)
        );
        const querySnapshotP = await getDocs(qP);

        const userContactsArray = [];
        querySnapshotP.forEach((doc) => {
          const player = { ...doc.data(), id: doc.id };
          userContactsArray.push(player);
        });
        setUserContacts(userContactsArray);
      };

      fetchData();
    }
  }, [userPlayerProfile]);

  return (
    <Section>
      {userContacts && userContacts.length > 0 && (
        <ul>
          {userContacts.map((contact) => (
            <li key={contact.id}>
              <Link to={`/${contact.id}`}>
                <PlayerIcon image={contact.image} />
              </Link>
              <p>{contact.username}</p>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
};

export default ContactsPage;
