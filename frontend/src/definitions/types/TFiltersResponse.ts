export type TFiltersResponse = {
  sports: string[];
  locations: string[];
  participants_counts: TParticipantsCount[];
}

type TParticipantsCount = {
  "participants_count": number,
  "count": number
}