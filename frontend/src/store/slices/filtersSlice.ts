import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TFiltersState} from "../../definitions/types/TFiltersState";

const initialState: TFiltersState = {
  sport: null,
  location: null,
  participantsCount: null,
  competitionType: null,
  gender: null,
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
    setCompetitionType(state, action: PayloadAction<string | null>) { // New action
      state.competitionType = action.payload;
    },
    setGender(state, action: PayloadAction<string | null>) { // New action
      state.gender = action.payload;
    },
    resetFilters(state) {
      state.sport = null;
      state.location = null;
      state.participantsCount = null;
      state.competitionType = null; // Reset new filter
      state.gender = null;           // Reset new filter
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
    resetCompetitionType(state) { // New reset action
      state.competitionType = null;
    },
    resetGender(state) { // New reset action
      state.gender = null;
    },
    resetAllFilters(state) {
      state.sport = null;
      state.location = null;
      state.participantsCount = null;
      state.competitionType = null; // Reset new filter
      state.gender = null;           // Reset new filter
    },
  },
});

export const {
  setSport,
  setLocation,
  setParticipantsCount,
  setCompetitionType,
  setGender,
  resetFilters,
  resetSport,
  resetLocation,
  resetParticipantsCount,
  resetCompetitionType,
  resetGender,
  resetAllFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;