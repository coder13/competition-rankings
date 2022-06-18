import { ListSubheader, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Box } from '@mui/system';
import { Competition } from '@wca/helpers';
import { useCallback, useMemo } from 'react';

export const parseActivityCode = (activityCode: string) => {
  const [, e, r, g, a] = activityCode.match(/(\w+)(?:-r(\d+))?(?:-g(\d+))?(?:-a(\d+))?/);
  return {
    eventId: e,
    roundNumber: r && parseInt(r, 10),
    groupNumber: g && parseInt(g, 10),
    attemptNumber: a && parseInt(a, 10),
  };
};

export default function SumOfRanks({ persons, events }: Competition) {
  const resultsForPerson = useCallback(
    (registrantId: number) =>
      events
        .map((event) =>
          event.rounds
            .map((round) => ({
              activityCode: round.id,
              finalRound: parseActivityCode(round.id)?.roundNumber === event.rounds.length,
              ...(round.results.find((result) => result.personId === registrantId) ?? {
                ranking: round.results.length,
              }),
            }))
            .map((result) => ({
              ...result,
              eventId: event.id,
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
          const rankings = allResults.map((result) => result.ranking);
          const finalRounds = allResults.filter((result) => !!result.finalRound);

          return {
            ...person,
            sumOfRanks: rankings.reduce((a, b) => a + b),
            medals: finalRounds.filter((result) => result.ranking <= 3),
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
            <TableCell>Medals</TableCell>
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
                <TableCell>
                  {person.medals.length > 0 &&
                    `${person.medals.length} (${person.medals
                      .map((medal) => medal.eventId)
                      .join(', ')})`}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Box>
  );
}
