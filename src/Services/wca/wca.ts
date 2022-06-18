import qs from 'qs';
import { WCA_ORIGIN } from '../../lib/wca-env';
import { BaseQueryFn, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { WCAObject, Competition, WCARequestError } from './types';
import type { Competition as WCIFCompetition } from '@wca/helpers';
import { FetchBaseQueryArgs } from '@reduxjs/toolkit/dist/query/fetchBaseQuery';

// Define a service using a base URL and expected endpoints
export const wcaAPI = createApi({
  reducerPath: 'wcaAPI',
  baseQuery: fetchBaseQuery({ baseUrl: `${WCA_ORIGIN}/api/v0/` }) as BaseQueryFn<
    string | FetchBaseQueryArgs,
    WCAObject,
    WCARequestError,
    {}
  >,
  endpoints: (builder) => ({
    getCompetitionById: builder.query<WCIFCompetition, string>({
      query: (id) => `competitions/${id}/wcif/public`,
    }),
    getCompetitions: builder.query<Competition[], {}>({
      query: (queryParams) => `competitions${qs.stringify(queryParams)}`,
    }),
  }),
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useGetCompetitionByIdQuery, useGetCompetitionsQuery } = wcaAPI;
