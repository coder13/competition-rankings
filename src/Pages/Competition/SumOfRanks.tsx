import {
  List,
  ListItem,
  ListSubheader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { Box } from '@mui/system';
import { Competition } from '@wca/helpers';
import { useCallback, useMemo } from 'react';

export default function SumOfRanks({ persons, events }: Competition) {
  const resultsForPerson = useCallback(
    (registrantId: number) =>
      events
        .map((event) =>
          event.rounds
            .map((round) => ({
              activityCode: round.id,
              ...(round.results.find((result) => result.personId === registrantId) ?? {
                ranking: round.results.length,
              }),
            }))
            .map((result) => ({
              ...result,
              eventId: 'eventId',
            }))
            .reduce((xs, x) => xs.concat(x), [])
        )
        .reduce((xs, x) => xs.concat(x), []),
    [events]
  );

  const personRanks = useMemo(
    () =>
      persons
        .filter((person) => person.registration?.status === 'accepted')
        .filter(({ registrantId }) =>
          events.some((event) =>
            event.rounds.some((round) =>
              round.results.find((result) => result.personId === registrantId)
            )
          )
        )
        .map((person) => {
          const allResults = resultsForPerson(person.registrantId);

          return {
            ...person,
            sumOfRanks: allResults.map((result) => result.ranking).reduce((a, b) => a + b),
          };
        }),
    [events, persons, resultsForPerson]
  );

  return (
    <Box>
      <ListSubheader>Sum Of Ranks</ListSubheader>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Position</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Sum of Ranks</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {personRanks
            .sort((a, b) => a.sumOfRanks - b.sumOfRanks)
            .map((person, index) => (
              <TableRow key={person.registrantId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{person.name}</TableCell>
                <TableCell>{person.sumOfRanks}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Box>
  );
}
