import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TFiltersState} from "../../definitions/types/TFiltersState";

const initialState: TFiltersState = {
  sport: null,
  location: null,
  participantsCount: null,
  competitionType: null,
  gender: null,
  q: null,
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
    setQ(state, action: PayloadAction<string | null>) { // New action to set search query
      state.q = action.payload;
    },
    resetFilters(state) {
      state.sport = null;
      state.location = null;
      state.participantsCount = null;
      state.competitionType = null;
      state.gender = null;
      state.q = null;
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
    resetQ(state) { // New action to reset search query
      state.q = null;
    },
    resetAllFilters(state) {
      state.sport = null;
      state.location = null;
      state.participantsCount = null;
      state.competitionType = null;
      state.gender = null;
      state.q = null; // Reset search query
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
  resetFilters,
  resetSport,
  resetLocation,
  resetParticipantsCount,
  resetCompetitionType,
  resetGender,
  resetQ,
  resetAllFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;