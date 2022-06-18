import { EventId } from '@wca/helpers';

export interface WCAObject {
  class: string;
}

export type ISODate = string;

export interface Competition extends WCAObject {
  url: string;
  id: string;
  name: string;
  website: string;
  short_name: string;
  city: string;
  venue_address: string;
  venue_details: string;
  latitude_degrees: number;
  longitude_degrees: number;
  country_iso2: string;
  start_date: ISODate;
  registration_open: ISODate;
  registration_close: ISODate;
  announced_at: ISODate;
  cancelled_at: ISODate | null;
  end_date: ISODate;
  delegates?: User[] | null;
  trainee_delegates?: User[] | null;
  organizers?: User[] | null;
  competitor_limit: number;
  event_ids?: EventId[];
}

export interface User extends WCAObject {
  url: string;
  id: number;
  wca_id: string | null;
  name: string;
  gender: string | null;
  country_iso2: string | null;
  delegate_status: string | null;
  created_at: ISODate;
  updated_at: ISODate;
  teams?: Team[];
  avatar: Avatar;
  email?: string;
  region?: string;
  senior_delegate_id?: number;
}

export interface Team {
  friendly_id: string; // TODO add specific teams?
  leader: boolean;
}

export interface Avatar {
  url: string;
  thumb_url: string;
  is_default: boolean;
}

export interface WCARequestError {
  error: string;
}

export interface FetchCompetitionsArgs {
  start?: ISODate;
  end?: ISODate;
  sort?: string;
}
