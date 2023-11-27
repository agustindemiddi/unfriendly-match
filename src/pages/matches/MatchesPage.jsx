import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { collection, getDocs, limit } from 'firebase/firestore';

import Section from '../../components/UI/Section';

import db from '../../utils/firebaseConfig';

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const params = useParams();

  useEffect(
    () => async () => {
      const matchesList = [];
      const querySnapshot = await getDocs(
        collection(db, 'tournaments', params.tournamentId, 'matches')
      );
      querySnapshot.forEach((doc) => {
        const item = {};
        item.id = doc.id;
        item.matchDateTime = doc
          .data()
          .matchDateTime?.toDate()
          .toLocaleString();
        item.address = doc.data().address;
        item.matchRegistryDateTime = doc
          .data()
          .matchRegistryDateTime?.toDate()
          .toLocaleString();
        item.admins = doc.data().admins;
        item.players = doc.data().players;
        item.matchCreationDateTime = doc.data().matchCreationDateTime;
        matchesList.push(item);
      });
      setMatches(matchesList);
    },
    []
  );

  return (
    <Section>
      <Link to='new'>
        <button>CREAR PARTIDO</button>
      </Link>
      <ul style={{ margin: '2rem' }}>
        {matches &&
          matches.length > 0 &&
          matches.map((match) => (
            <li key={match.id} style={{ margin: '2rem' }}>
              <div style={{ border: '1px solid white' }}>
                <p>matchDateTime: {match.matchDateTime}</p>
                <p>address: {match.address}</p>
                <p>matchRegistryDateTime: {match.matchRegistryDateTime}</p>
                <p>admins: {match.admins[0]}</p>
                <p>players: {match.players[0]}</p>
                <p>matchCreationDateTime: {match.matchCreationDateTime}</p>
                <Link to={`${match.id}`}>
                  <button>Entrar</button>
                </Link>
              </div>
            </li>
          ))}
      </ul>
    </Section>
  );
};

export default MatchesPage;
