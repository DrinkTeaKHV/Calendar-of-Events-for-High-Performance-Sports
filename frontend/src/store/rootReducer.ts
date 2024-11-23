import {combineReducers} from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import authReducer from './slices/authSlice';
import modeReducer from "./slices/modeSlice";
import {apiSlice} from "./slices/apiSlice";

const rootReducer = combineReducers({
  mode: modeReducer,
  auth: authReducer,
  theme: themeReducer,
  [apiSlice.reducerPath]: apiSlice.reducer
  // Добавьте другие редьюсеры здесь
});

export default rootReducer;
