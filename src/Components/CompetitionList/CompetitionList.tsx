import { Box, List } from '@mui/material';
import { Competition, useGetCompetitionsQuery } from 'Services';
import CompetitionListItemLink from './CompetitionListItemLink';

export default function CompetitionList() {
  const {
    data: competitions = [],
    isLoading,
    error,
  } = useGetCompetitionsQuery({
    start: new Date(Date.now() - 2 * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date(Date.now()).toISOString().split('T')[0],
  });

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
