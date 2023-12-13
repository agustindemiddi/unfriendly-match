import { useState, useEffect } from 'react';
import {
  query,
  collection,
  where,
  documentId,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';

import SoccerField from './SoccerField';

import db from '../../../utils/firebase/firebaseConfig';

import createPlayerObjectFromFirestore from '../../../utils/firebase/firestore/createPlayerObjectFromFirestore';
import getMatchStatus from '../../../utils/getMatchStatus';
import formatDate from '../../../utils/formatDate';

const SoccerFieldContainer = ({
  match: {
    tournament,
    creator,
    admins,
    creationDateTime,
    registryDateTime,
    dateTime,
    address,
    playerQuota,
    players,
    teamA,
    teamB,
    result,
    mvps,
  },
}) => {
  const [tournamentImage, setTournamentImage] = useState('');
  const [registeredPlayers, setRegisteredPlayers] = useState([]);
  const [teamAPlayers, setTeamAPlayers] = useState([]);
  const [teamBPlayers, setTeamBPlayers] = useState([]);
  const [matchRegistryCountdown, setMatchRegistryCountdown] = useState('');

  const {
    isActive,
    isRegistryStarted,
    isRegistryEnded,
    remainingPlayersQuota,
    isRegistryOpen,
    mvpsString,
  } = getMatchStatus({
    result,
    dateTime,
    registryDateTime,
    players,
    playerQuota,
    teamAPlayers,
    teamBPlayers,
    mvps,
  });

  // get tournament image >>>
  useEffect(() => {
    if (tournament) {
      // 'if' statement maybe not needed > check
      const fetchData = async () => {
        const docRef = doc(db, `tournaments/${tournament}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTournamentImage(docSnap.data().image);
        } else {
          console.log('No such document!');
        }
      };

      fetchData();
    }
  }, [tournament]);
  // get tournament image (end) <<<

  // get match registered players >>>
  useEffect(() => {
    if (players && players.length > 0) {
      const fetchData = async () => {
        const q = query(
          collection(db, 'players'),
          where(documentId(), 'in', players)
        );
        const querySnapshot = await getDocs(q);

        const registeredPlayersList = querySnapshot.docs.map((player) =>
          createPlayerObjectFromFirestore(player)
        );
        setRegisteredPlayers(registeredPlayersList);
      };

      fetchData();
    }
  }, [players]);
  // get match registered players (end) <<<

  // get match teams >>>
  useEffect(() => {
    if (teamA && teamA.length > 0 && teamB && teamB.length > 0) {
      const fetchData = async () => {
        const qA = query(
          collection(db, 'players'),
          where(documentId(), 'in', teamA)
        );
        const querySnapshotA = await getDocs(qA);
        const teamAArray = querySnapshotA.docs.map((player) =>
          createPlayerObjectFromFirestore(player)
        );
        setTeamAPlayers(teamAArray);

        const qB = query(
          collection(db, 'players'),
          where(documentId(), 'in', teamB)
        );
        const querySnapshotB = await getDocs(qB);
        const teamBArray = querySnapshotB.docs.map((player) =>
          createPlayerObjectFromFirestore(player)
        );
        setTeamBPlayers(teamBArray);
      };

      fetchData();
    }
  }, [teamA, teamB]);
  // get match teams (end) <<<

  // set countdown to match registry date time >>>
  useEffect(() => {
    const calculateCountdown = () => {
      const currentDateTime = new Date();
      const timeDifference = registryDateTime - currentDateTime;

      if (timeDifference > 0) {
        const seconds = Math.floor((timeDifference / 1000) % 60);
        const minutes = Math.floor((timeDifference / 1000 / 60) % 60);
        const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        setMatchRegistryCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setMatchRegistryCountdown('Match registry already started');
      }
    };

    const intervalId = setInterval(calculateCountdown, 1000);

    return () => clearInterval(intervalId);
  }, [registryDateTime]);
  // set countdown to match registry date time <<<

  const formattedRegistryDateTime = formatDate(registryDateTime);
  const formattedDateTime = formatDate(dateTime);

  return (
    <SoccerField
      matchProps={{
        tournament,
        // creator,
        // admins,
        // creationDateTime,
        registryDateTime,
        dateTime,
        address,
        // playerQuota,
        // players,
        // teamA,
        // teamB,
        result,
        // mvps,
        isActive,
        isRegistryStarted,
        isRegistryEnded,
        remainingPlayersQuota,
        isRegistryOpen,
        mvpsString,
        tournamentImage,
        registeredPlayers,
        teamAPlayers,
        teamBPlayers,
        formattedRegistryDateTime,
        formattedDateTime,
        matchRegistryCountdown,
      }}
    />
  );
};

export default SoccerFieldContainer;
