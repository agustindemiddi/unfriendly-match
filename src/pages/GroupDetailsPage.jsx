import { useParams } from 'react-router-dom';

import PageContent from '../components/UI/PageContent';
import GroupItem from '../components/GroupItem';

import DUMMY_BACKEND from '../DUMMY/DUMMY_BACKEND';

const GroupDetailsPage = () => {
  const params = useParams();

  const item = DUMMY_BACKEND[1].list.filter(
    (item) => item.id === params.groupId
  )[0];

  return (
    <PageContent title='GroupDetailsPage'>
      <GroupItem item={item} />
    </PageContent>
  );
};
export default GroupDetailsPage;
