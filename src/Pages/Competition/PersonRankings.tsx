import { useCallback, useMemo, useState } from 'react';
import { Box } from '@mui/system';
import {
  Alert,
  FormControlLabel,
  FormGroup,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Competition, EventId, Person, Result, Round } from '@wca/helpers';
import HelpPopover from './HelpPopover';

const rankingResult = (round: Round, result: Result): number => {
  switch (round.format) {
    case '1':
    case '2':
    case '3':
      return result.best as number;
    case 'a':
    case 'm':
      return result.average as number;
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

const computeKinch = (eventId: String, round: Round, winningResult: number, result: Result) => {
  if (!winningResult || !result) {
    return 0;
  }

  if (rankingResult(round, result) <= 0) {
    return 0;  
  }

  if (eventId === '333mbf') {
    return (result.best as number) / winningResult;
  }

  return winningResult / (rankingResult(round, result) as number)
}

interface ExtendedPerson extends Person {
  sumOfRanks: number;
  kinch: number;
  medals: EventId[];
}

type SortColumns = 'name' | 'kinch' | 'medals' | 'sumOfRanks';
const sortMethod = {
  name: (a: ExtendedPerson, b: ExtendedPerson): number => a.name.localeCompare(b.name),
  kinch: (a: ExtendedPerson, b: ExtendedPerson): number => b.kinch - a.kinch,
  medals: (a: ExtendedPerson, b: ExtendedPerson): number => b.medals.length - a.medals.length,
  sumOfRanks: (a: ExtendedPerson, b: ExtendedPerson): number => a.sumOfRanks - b.sumOfRanks,
};

export default function PersonRankings({ persons, events }: Competition) {
  const [sort, setSort] = useState<SortColumns>('sumOfRanks');
  const [onlyFinalRounds, setOnlyFinalRounds] = useState(true);

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
            missingResults: round.results.filter((result) => !result.ranking),
          };
        }),
      })),
    [events]
  );

  const allMissingResults = useMemo(
    () => eventsExpanded.reduce((acc, event) => acc.concat(event.rounds.flatMap((round) => round.missingResults)), []),
    [eventsExpanded]
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
                  ranking: round.results.length + 1,
                }),
                kinch: computeKinch(event.id, round, winningResult, result),
              };
            })
            .map((result) => ({
              ...result,
              eventId: event.id,
            }))
            .reduce((xs, x) => xs.concat(x), [])
        )
        .reduce((xs, x) => xs.concat(x), [])
        .filter((result) => (onlyFinalRounds ? result.finalRound : true)),
    [eventsExpanded, onlyFinalRounds]
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
            medals: finalRounds.filter((result) => result.ranking && result.ranking <= 3),
            kinch,
          } as ExtendedPerson;
        }),
    [events, persons, resultsForPerson]
  );

  return (
    <Box>
      {allMissingResults.length > 0 && (
        <Alert severity="warning">
          <p>This competition may not be over or the organization staff have not synchronized all of the results.
          There are currently {allMissingResults.length} Missing Results.</p>
        </Alert>
      )}
      <Box>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={onlyFinalRounds}
                onChange={(e) => setOnlyFinalRounds(e.currentTarget.checked)}
              />
            }
            label="Only final rounds"
          />
        </FormGroup>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ margin: '1em 1em' }}>Position</TableCell>
            <TableCell style={{ margin: '1em 1em' }}>
              <span
                style={{ cursor: 'pointer', fontWeight: sort === 'name' ? 'bold' : 'normal' }}
                onClick={() => setSort('name')}
              >
                {sort === 'name' && <ArrowDownwardIcon fontSize="small" />}
                Name
              </span>
            </TableCell>
            <TableCell style={{ margin: '1em 1em' }}>
              <span
                style={{ cursor: 'pointer', fontWeight: sort === 'sumOfRanks' ? 'bold' : 'normal' }}
                onClick={() => setSort('sumOfRanks')}
              >
                {sort === 'sumOfRanks' && <ArrowDownwardIcon fontSize="small" />}
                Sum of Ranks
              </span>{' '}
            </TableCell>
            <TableCell style={{ margin: '1em 1em' }}>
              <span
                style={{ cursor: 'pointer', fontWeight: sort === 'kinch' ? 'bold' : 'normal' }}
                onClick={() => setSort('kinch')}
              >
                {sort === 'kinch' && <ArrowDownwardIcon fontSize="small" />}
                Kinch
              </span>
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
            <TableCell style={{ margin: '1em 1em' }}>
              <span
                style={{ cursor: 'pointer', fontWeight: sort === 'medals' ? 'bold' : 'normal' }}
                onClick={() => setSort('medals')}
              >
                {sort === 'medals' && <ArrowDownwardIcon fontSize="small" />}
                Medals
              </span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {personRanks
            .sort((a, b) => sortMethod[sort]?.(a, b) ?? 0)
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
