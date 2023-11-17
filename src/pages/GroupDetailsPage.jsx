import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

import PageContent from '../components/UI/PageContent';
import GroupItem from '../components/Groups/GroupItem';

import db from '../utils/firebaseConfig';

const GroupDetailsPage = () => {
  const [group, setGroup] = useState({});
  const params = useParams();

  useEffect(
    () => async () => {
      const docRef = doc(db, 'groups', params.groupId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setGroup(docSnap.data());
      } else {
        console.error('Group not found!');
      }
    },
    []
  );

  return (
    <PageContent title='GroupDetailsPage'>
      <GroupItem item={group} />
    </PageContent>
  );
};

export default GroupDetailsPage;
