import { Box, List } from '@mui/material';
import { Competition, useGetCompetitionsQuery } from 'Services';
import CompetitionListItemLink from './CompetitionListItemLink';

export default function CompetitionList() {
  const {
    data: competitions = [],
    isLoading,
    error,
    ...query
  } = useGetCompetitionsQuery({
    end: new Date().toISOString(),
  });

  console.log(competitions, isLoading, error, query);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error(error);
    return <div>Error!</div>;
  }

  return (
    <Box>
      {competitions.length > 0 ? (
        <List>
          {competitions.map((competition: Competition) => (
            <CompetitionListItemLink key={competition.id} {...competition} />
          ))}
        </List>
      ) : (
        <Box>No Competitions</Box>
      )}
    </Box>
  );
}
