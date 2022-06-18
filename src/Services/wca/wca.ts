import { WCA_ORIGIN } from '../../lib/wca-env';
import { BaseQueryFn, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { WCAObject, Competition, WCARequestError, FetchCompetitionsArgs } from './types';
import type { Competition as WCIFCompetition } from '@wca/helpers';

// Define a service using a base URL and expected endpoints
export const wcaAPI = createApi({
  reducerPath: 'wcaAPI',
  baseQuery: fetchBaseQuery({ baseUrl: `${WCA_ORIGIN}/api/v0/` }) as BaseQueryFn<
    any,
    WCAObject | WCAObject[],
    WCARequestError
  >,
  endpoints: (builder) => ({
    getCompetitionById: builder.query<WCIFCompetition, string>({
      query: (id) => `competitions/${id}/wcif/public`,
    }),
    getCompetitions: builder.query<Competition[], FetchCompetitionsArgs>({
      query: (queryParams) => ({
        url: `competitions`,
        params: queryParams,
      }),
    }),
  }),
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useGetCompetitionByIdQuery, useGetCompetitionsQuery } = wcaAPI;
