import { Divider, TextField, Typography } from '@mui/material';
import CompetitionList from 'Components/CompetitionList';
import useDebounce from 'Hooks/useDebounce';
import { useState } from 'react';
import { useGetCompetitionsQuery } from 'Services';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const queryParams = debouncedSearchQuery
    ? {
        q: debouncedSearchQuery,
      }
    : {
        start: new Date(Date.now() - 2 * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date(Date.now()).toISOString().split('T')[0],
      };

  const { data: competitions = [], isLoading, error } = useGetCompetitionsQuery(queryParams);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error(error);
    return <div>Error!</div>;
  }

  return (
    <div>
      <Typography>
        <br />
        Welcome to Competition-Rankings! This website will show sum of competition ranks and Kinch
        scores for everyone at a competition.
        <br />
        Note: This website is a WIP and only competitions that used WCA-Live will work.
        <br />
        If you navigate to a competition and don't see results, that's either because the
        competition hasn't ended or that the competition isn't supported yet.
        <br />
      </Typography>
      <TextField
        id="competition-rankings-competition-search"
        label="Search"
        variant="standard"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          width: '100%',
        }}
      />
      <Divider />
      <p>Competitions: </p>
      <CompetitionList competitions={competitions} />
    </div>
  );
}
