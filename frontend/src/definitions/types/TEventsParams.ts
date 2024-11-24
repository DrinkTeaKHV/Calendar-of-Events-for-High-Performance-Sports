export type TEventsParams = {
  page: number;
  pageSize: number;
  sport?: string | null;
  location?: string | null;
  participantsCount?: number | null;
}