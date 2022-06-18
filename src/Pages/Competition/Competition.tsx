import { useParams } from 'react-router-dom';
import { useGetCompetitionByIdQuery } from 'Services';
import PersonRankings from './PersonRankings';

export default function Competition() {
  const { competitionId } = useParams();
  const { data: competition, isLoading, error } = useGetCompetitionByIdQuery(competitionId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error(error);
    return <div>Error!</div>;
  }

  return (
    <div>
      <p>{competition.name}</p>
      <PersonRankings {...competition} />
    </div>
  );
}
