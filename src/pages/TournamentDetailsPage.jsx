import { useParams } from 'react-router-dom';

import PageContent from '../components/UI/PageContent';
import TournamentItem from '../components/TournamentItem';

import DUMMY_BACKEND from '../DUMMY/DUMMY_BACKEND';

const TournamentDetailsPage = () => {
  const params = useParams();

  const item = DUMMY_BACKEND[0].list.filter(
    (item) => item.id === params.tournamentId
  )[0];

  return (
    <PageContent title='TournamentDetailsPage'>
      <TournamentItem item={item} />
    </PageContent>
  );
};

export default TournamentDetailsPage;
