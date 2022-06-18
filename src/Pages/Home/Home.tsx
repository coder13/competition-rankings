import { Divider, TextField } from '@mui/material';
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
      <TextField
        id="competition-search-basic"
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
