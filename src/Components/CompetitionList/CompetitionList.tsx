import { Box, List } from '@mui/material';
import { Competition } from 'Services';
import CompetitionListItemLink from './CompetitionListItemLink';

export default function CompetitionList({ competitions }: { competitions: Competition[] }) {
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
