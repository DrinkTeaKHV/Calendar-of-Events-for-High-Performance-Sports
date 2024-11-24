import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TFiltersState} from "../../definitions/types/TFiltersState";

const initialState: TFiltersState = {
  sport: null,
  location: null,
  participantsCount: null,
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
    resetFilters(state) {
      state.sport = null;
      state.location = null;
      state.participantsCount = null;
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
    resetAllFilters(state) {
      state.sport = null;
      state.location = null;
      state.participantsCount = null;
    },
  },
});

export const {
  setSport,
  setLocation,
  setParticipantsCount,
  resetFilters,
  resetSport,
  resetLocation,
  resetParticipantsCount,
  resetAllFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;