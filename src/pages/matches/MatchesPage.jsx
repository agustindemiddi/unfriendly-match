import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { collection, getDocs, limit } from 'firebase/firestore';

import Section from '../../components/UI/Section';

import db from '../../utils/firebase/firebaseConfig';
import separateMatches from '../../utils/separateMatches';
import formatDate from '../../utils/formatDate';

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const params = useParams();

  const {
    sortedUpcomingMatches,
    reverseSortedPreviousMatches,
    nextMatch,
    lastMatch,
  } = separateMatches(matches);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(
        collection(db, 'tournaments', params.tournamentId, 'matches')
      );
      const matchesList = [];
      querySnapshot.forEach((doc) => {
        const item = {};
        item.id = doc.id;
        item.matchDateTime = doc.data().matchDateTime?.toDate();
        item.address = doc.data().address;
        item.matchRegistryDateTime = doc.data().matchRegistryDateTime?.toDate();
        item.admins = doc.data().admins;
        item.players = doc.data().players;
        item.matchCreationDateTime = doc.data().matchCreationDateTime?.toDate();
        matchesList.push(item);
      });
      setMatches(matchesList);
    };

    fetchData();
  }, [params.tournamentId]);

  return (
    <Section>
      <button onClick={() => console.log(sortedUpcomingMatches)}>print</button>
      <Link to='new'>
        <button>CREAR PARTIDO</button>
      </Link>
      <h2>UPCOMING MATCHES</h2>
      <ul style={{ margin: '2rem' }}>
        {sortedUpcomingMatches &&
          sortedUpcomingMatches.length > 0 &&
          sortedUpcomingMatches.map((match) => (
            <li key={match.id} style={{ margin: '2rem' }}>
              <div style={{ border: '1px solid white' }}>
                <p>matchDateTime: {formatDate(match.matchDateTime)}</p>
                <p>address: {match.address}</p>
                <p>matchRegistryDateTime: {formatDate(match.matchDateTime)}</p>
                <p>admins: {match.admins[0]}</p>
                <p>players: {match.players[0]}</p>
                <p>matchCreationDateTime: {formatDate(match.matchDateTime)}</p>
                <Link to={`${match.id}`}>
                  <button>Entrar</button>
                </Link>
              </div>
            </li>
          ))}
      </ul>
      <h2>PREVIOUS MATCHES</h2>
      <ul style={{ margin: '2rem' }}>
        {reverseSortedPreviousMatches &&
          reverseSortedPreviousMatches.length > 0 &&
          reverseSortedPreviousMatches.map((match) => (
            <li key={match.id} style={{ margin: '2rem' }}>
              <div style={{ border: '1px solid white' }}>
                <p>matchDateTime: {formatDate(match.matchDateTime)}</p>
                <p>address: {match.address}</p>
                <p>matchRegistryDateTime: {formatDate(match.matchDateTime)}</p>
                <p>admins: {match.admins[0]}</p>
                <p>players: {match.players[0]}</p>
                <p>matchCreationDateTime: {formatDate(match.matchDateTime)}</p>
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
