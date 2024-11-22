import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {EThemeSwitcher} from "../../definitions/enums/EThemeSwitcher";
import {TThemeState} from "../../definitions/types/TThemeState";

const savedTheme = localStorage.getItem('theme') as EThemeSwitcher | null;

const initialState: TThemeState = {
  mode: savedTheme || EThemeSwitcher.light,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === EThemeSwitcher.light ? EThemeSwitcher.dark : EThemeSwitcher.light;
      localStorage.setItem('theme', state.mode);
    },
    setTheme: (state, action: PayloadAction<EThemeSwitcher>) => {
      state.mode = action.payload;
      localStorage.setItem('theme', state.mode);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;