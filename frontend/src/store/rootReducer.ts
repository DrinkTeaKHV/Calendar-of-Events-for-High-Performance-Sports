import authReducer from '../features/Login/loginSlice';
import {combineReducers} from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import {apiSlice} from "./slices/apiSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  [apiSlice.reducerPath]: apiSlice.reducer
  // Добавьте другие редьюсеры здесь
});

export default rootReducer;
