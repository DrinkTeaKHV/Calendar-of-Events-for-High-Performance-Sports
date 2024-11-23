import {EModeSwitcher} from "../../definitions/enums/EModeSwitcher";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
  mode: EModeSwitcher.events
}

export const modeSlice = createSlice({
  name: 'mode',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<EModeSwitcher>) => {
      state.mode = action.payload;
    }
  }
})

export const { setMode } = modeSlice.actions;
export default modeSlice.reducer;