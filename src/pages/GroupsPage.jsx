import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';

import PageContent from '../components/UI/PageContent';
import Dashboard from '../components/Dashboard/Dashboard';

import db from '../utils/firebaseConfig';

const GroupsPage = () => {
  const [groupsList, setGroupsList] = useState([]);

  useEffect(
    () => async () => {
      const groupsList = [];
      const querySnapshot = await getDocs(collection(db, 'groups'));
      querySnapshot.forEach((doc) => {
        const item = {};
        item.id = doc.id;
        item.name = doc.data().name;
        item.image = doc.data().image;
        item.players = doc.data().players;
        groupsList.push(item);
        setGroupsList(groupsList);
      });
    },
    []
  );

  return (
    <PageContent title='My Groups'>
      {groupsList && groupsList.length > 0 && (
        <Dashboard list={groupsList} url='/groups' />
      )}
    </PageContent>
  );
};

export default GroupsPage;
