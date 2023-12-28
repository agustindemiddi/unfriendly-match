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
import PlayerIconContainer from '../../components/Matches/PlayerIcon/PlayerIconContainer';

import db from '../../utils/firebase/firebaseConfig';
import { getUserAuthCtx } from '../../context/authContext';
import { createPlayerObjectFromFirestore } from '../../utils/firebase/firestore/firestoreActions';

const ContactsPage = () => {
  const { userPlayerProfile } = getUserAuthCtx();
  const [userContacts, setUserContacts] = useState([]);

  console.log(userPlayerProfile);

  useEffect(() => {}, []);

  // useEffect(() => {
  //   if (userPlayerProfile) {
  //     const fetchData = async () => {
  //       const qT = query(
  //         collection(db, 'tournaments'),
  //         where(documentId(), 'in', userPlayerProfile.tournaments)
  //       );
  //       const querySnapshotT = await getDocs(qT);

  //       const userTournamentsArray = [];
  //       querySnapshotT.forEach((doc) => {
  //         const tournament = { ...doc.data(), id: doc.id };
  //         userTournamentsArray.push(tournament);
  //       });

  //       const allContactsIds = Array.from(
  //         new Set(
  //           userTournamentsArray.flatMap((tournament) => tournament.players)
  //         )
  //       ).filter((playerId) => playerId !== userPlayerProfile.id);

  //       const qP = query(
  //         collection(db, 'players'),
  //         where(documentId(), 'in', allContactsIds)
  //       );
  //       const querySnapshotP = await getDocs(qP);

  //       const userContactsArray = [];
  //       querySnapshotP.forEach((doc) => {
  //         // const player = { ...doc.data(), id: doc.id };
  //         const player = createPlayerObjectFromFirestore(doc);
  //         userContactsArray.push(player);
  //       });
  //       setUserContacts(userContactsArray);
  //     };

  //     fetchData();
  //   }
  // }, [userPlayerProfile]);

  return (
    <Section>
      {userContacts && userContacts.length > 0 && (
        <ul>
          {userContacts.map((contact) => (
            <li key={contact.id}>
              <Link to={`/${contact.id}`}>
                <PlayerIconContainer image={contact.image} />
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
