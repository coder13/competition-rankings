import { Box, List } from '@mui/material';
import { Competition, useGetCompetitionsQuery } from 'Services';
import CompetitionListItemLink from './CompetitionListItemLink';

export default function CompetitionList() {
  const { data: competitions, isLoading, error } = useGetCompetitionsQuery({});

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error(error);
    return <div>Error!</div>;
  }

  return (
    <Box>
      <List>
        {competitions.map((competition: Competition) => (
          <CompetitionListItemLink {...competition} />
        ))}
      </List>
    </Box>
  );
}
