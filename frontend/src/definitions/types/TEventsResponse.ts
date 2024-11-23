export type Event = {
  id: number;
  sm_number: string;
  name: string;
  participants: string;
  gender: string;
  competition_type: string;
  start_date: string;
  end_date: string;
  location: string;
  participants_count: number;
  reserve: boolean;
  sport: string;
  month: string;
  year: number;
  min_age: number;
  max_age: number;
}

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type TEventsResponse = PaginatedResponse<Event>;