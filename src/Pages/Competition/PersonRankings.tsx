import { Box } from '@mui/system';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Competition, Result, Round } from '@wca/helpers';
import { useCallback, useMemo } from 'react';
import HelpPopover from './HelpPopover';

const rankingResult = (round: Round, result: Result) => {
  switch (round.format) {
    case '1':
    case '2':
    case '3':
      return result.best;
    case 'a':
    case 'm':
      return result.average;
  }
};

export const parseActivityCode = (activityCode: string) => {
  const [, e, r, g, a] = activityCode.match(/(\w+)(?:-r(\d+))?(?:-g(\d+))?(?:-a(\d+))?/);
  return {
    eventId: e,
    roundNumber: r && parseInt(r, 10),
    groupNumber: g && parseInt(g, 10),
    attemptNumber: a && parseInt(a, 10),
  };
};

export default function PersonRankings({ persons, events }: Competition) {
  const eventsExpanded = useMemo(
    () =>
      events.map((event) => ({
        ...event,
        rounds: event.rounds.map((round) => {
          const winningResult = round.results.find((result) => result.ranking === 1);

          return {
            ...round,
            eventId: event.id,
            finalRound: parseActivityCode(round.id)?.roundNumber === event.rounds.length,
            activitiyId: round.id,
            winningResult: winningResult && rankingResult(round, winningResult),
          };
        }),
      })),
    [events]
  );

  const resultsForPerson = useCallback(
    (registrantId: number) =>
      eventsExpanded
        .map((event) =>
          event.rounds
            .map((round) => {
              const result = round.results.find((result) => result.personId === registrantId);
              const winningResult = round.winningResult;

              return {
                activityCode: round.id,
                finalRound: round.finalRound,
                ...(result ?? {
                  ranking: round.results.length,
                }),
                kinch:
                  event.id !== '333mbf' &&
                  result &&
                  winningResult &&
                  winningResult > 0 &&
                  rankingResult(round, result) > 0
                    ? (winningResult as number) / (rankingResult(round, result) as number)
                    : 0,
              };
            })
            .map((result) => ({
              ...result,
              eventId: event.id,
            }))
            .reduce((xs, x) => xs.concat(x), [])
        )
        .reduce((xs, x) => xs.concat(x), []),
    [eventsExpanded]
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
          const kinch =
            allResults.filter((result) => result.best > 0).reduce((a, b) => a + b.kinch, 0) /
            allResults.length;

          return {
            ...person,
            sumOfRanks: rankings.reduce((a, b) => a + b),
            medals: finalRounds.filter((result) => result.ranking <= 3),
            kinch,
          };
        }),
    [events, persons, resultsForPerson]
  );

  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Position</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Sum of Ranks</TableCell>
            <TableCell>
              Kinch
              <HelpPopover>
                <p>
                  For each person, this is the average and all rounds of
                  <br />
                  <code>winning result / ranking result</code>
                </p>
                <p>
                  If the winning result or ranking result is not a valid result, the kinch is
                  assumed to be 0.
                </p>
              </HelpPopover>
            </TableCell>
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
                <TableCell>{(person.kinch * 100).toFixed(2)}</TableCell>
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
