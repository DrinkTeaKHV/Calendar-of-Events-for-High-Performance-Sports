import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
  sport: string | null;
  location: string | null;
  participantsCount: number | null;
  competitionType: string | null;
  gender: string | null;
  q: string | null;
  start_date: string | null;
  end_date: string | null;
  ordering: string | null;
}

const initialState: FiltersState = {
  sport: null,
  location: null,
  participantsCount: null,
  competitionType: null,
  gender: null,
  q: null,
  start_date: null,
  end_date: null,
  ordering: null,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSport(state, action: PayloadAction<string | null>) {
      state.sport = action.payload;
    },
    setLocation(state, action: PayloadAction<string | null>) {
      state.location = action.payload;
    },
    setParticipantsCount(state, action: PayloadAction<number | null>) {
      state.participantsCount = action.payload;
    },
    setCompetitionType(state, action: PayloadAction<string | null>) {
      state.competitionType = action.payload;
    },
    setGender(state, action: PayloadAction<string | null>) {
      state.gender = action.payload;
    },
    setQ(state, action: PayloadAction<string | null>) {
      state.q = action.payload;
    },
    setStartDate(state, action: PayloadAction<string | null>) {
      state.start_date = action.payload;
    },
    setEndDate(state, action: PayloadAction<string | null>) {
      state.end_date = action.payload;
    },
    setOrdering(state, action: PayloadAction<string | null>) {
      state.ordering = action.payload;
    },
    resetSport(state) {
      state.sport = null;
    },
    resetLocation(state) {
      state.location = null;
    },
    resetParticipantsCount(state) {
      state.participantsCount = null;
    },
    resetCompetitionType(state) {
      state.competitionType = null;
    },
    resetGender(state) {
      state.gender = null;
    },
    resetQ(state) {
      state.q = null;
    },
    resetStartDate(state) {
      state.start_date = null;
    },
    resetEndDate(state) {
      state.end_date = null;
    },
    resetOrdering(state) {
      state.ordering = null;
    },
    resetAllFilters(state) {
      state.sport = null;
      state.location = null;
      state.participantsCount = null;
      state.competitionType = null;
      state.gender = null;
      state.q = null;
      state.start_date = null;
      state.end_date = null;
      state.ordering = null;
    },
  },
});

export const {
  setSport,
  setLocation,
  setParticipantsCount,
  setCompetitionType,
  setGender,
  setQ,
  setStartDate,
  setEndDate,
  setOrdering,
  resetSport,
  resetLocation,
  resetParticipantsCount,
  resetCompetitionType,
  resetGender,
  resetQ,
  resetStartDate,
  resetEndDate,
  resetOrdering,
  resetAllFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;