export type TFiltersResponse = {
  sports: string[];
  locations: string[];
  participants_counts: TParticipantsCount[];
  competition_types: string[];
  gender: string[];
}

type TParticipantsCount = {
  "participants_count": number,
  "count": number
}