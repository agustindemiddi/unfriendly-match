import { useState, useEffect } from 'react';
import {
  query,
  collection,
  where,
  documentId,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

import SoccerField from './SoccerField';

import db from '../../../utils/firebase/firebaseConfig';
import { getUserAuthCtx } from '../../../context/AuthContext';

import createPlayerObjectFromFirestore from '../../../utils/firebase/firestore/createPlayerObjectFromFirestore';
import getMatchStatus from '../../../utils/getMatchStatus';
import formatDate from '../../../utils/formatDate';
import createMatchObjectFromFirestore from '../../../utils/firebase/firestore/createMatchObjectFromFirestore';

const SoccerFieldContainer = ({ match }) => {
  const [updatedMatch, setUpdatedMatch] = useState(match);
  const [tournamentImage, setTournamentImage] = useState('');
  const [registeredPlayers, setRegisteredPlayers] = useState([]);
  const [teamAPlayers, setTeamAPlayers] = useState([]);
  const [teamBPlayers, setTeamBPlayers] = useState([]);
  const [matchRegistryCountdown, setMatchRegistryCountdown] = useState('');
  const {
    userPlayerProfile: { id: userId },
  } = getUserAuthCtx();

  const {
    id: matchId,
    tournament: tournamentId,
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
  } = updatedMatch;

  const {
    isRegistryStarted,
    isRegistryEnded,
    remainingPlayersQuota,
    isRegistryOpen,
    mvpsString,
    isUserSubscribed,
  } = getMatchStatus({
    result,
    registryDateTime,
    dateTime,
    playerQuota,
    players,
    teamAPlayers,
    teamBPlayers,
    mvps,
    userId,
  });

  // get tournament image >>>
  useEffect(() => {
    if (tournamentId) {
      // 'if' statement maybe not needed > check
      const fetchData = async () => {
        const docRef = doc(db, `tournaments/${tournamentId}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTournamentImage(docSnap.data().image);
        } else {
          console.log('No such document!');
        }
      };

      fetchData();
    }
  }, [tournamentId]);
  // get tournament image (end) <<<

  // get match registered players >>>
  useEffect(() => {
    if (players && players.length > 0) {
      const fetchMatchPlayers = async () => {
        const q = query(
          collection(db, 'players'),
          where(documentId(), 'in', players)
        );
        const querySnapshot = await getDocs(q);

        const registeredPlayersList = querySnapshot.docs.map((playerDoc) =>
          createPlayerObjectFromFirestore(playerDoc)
        );
        setRegisteredPlayers(registeredPlayersList);
      };

      fetchMatchPlayers();
    } else {
      setRegisteredPlayers([]);
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

  const handleSubscribeToMatch = async () => {
    if (isRegistryOpen && !isUserSubscribed) {
      const updateMatch = async () => {
        const matchRef = doc(
          db,
          `tournaments/${tournamentId}/matches/${matchId}`
        );

        await updateDoc(matchRef, {
          players: arrayUnion(userId),
        });
      };

      updateMatch();

      const fetchMatch = async () => {
        const matchRef = doc(
          db,
          `tournaments/${tournamentId}/matches/${matchId}`
        );
        const matchSnap = await getDoc(matchRef);

        if (matchSnap.exists()) {
          setUpdatedMatch(createMatchObjectFromFirestore(matchSnap));
        } else {
          console.log('Match not found!');
        }
      };

      fetchMatch();
    }
  };

  const handleUnsubscribeToMatch = async () => {
    if (isRegistryOpen && isUserSubscribed) {
      const updateMatch = async () => {
        const matchRef = doc(
          db,
          `tournaments/${tournamentId}/matches/${matchId}`
        );

        await updateDoc(matchRef, {
          players: arrayRemove(userId),
        });
      };

      updateMatch();

      const fetchMatch = async () => {
        const matchRef = doc(
          db,
          `tournaments/${tournamentId}/matches/${matchId}`
        );
        const matchSnap = await getDoc(matchRef);

        if (matchSnap.exists()) {
          setUpdatedMatch(createMatchObjectFromFirestore(matchSnap));
        } else {
          console.log('Match not found!');
        }
      };

      fetchMatch();
    }
  };

  return (
    <SoccerField
      matchProps={{
        tournamentId,
        // creator,
        // admins,
        // creationDateTime,
        registryDateTime,
        dateTime,
        address,
        playerQuota,
        // players,
        // teamA,
        // teamB,
        result,
        // mvps,
        // isActive,
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
        handleSubscribeToMatch,
        isUserSubscribed,
        handleUnsubscribeToMatch,
      }}
    />
  );
};

export default SoccerFieldContainer;
