import {combineReducers} from '@reduxjs/toolkit';
import sidebarReducer from "./slices/siderbarSlice";
import themeReducer from './slices/themeSlice';
import authReducer from './slices/authSlice';
import modeReducer from "./slices/modeSlice";
import {apiSlice} from "./slices/apiSlice";

const rootReducer = combineReducers({
  mode: modeReducer,
  auth: authReducer,
  theme: themeReducer,
  sidebar: sidebarReducer,
  [apiSlice.reducerPath]: apiSlice.reducer
});

export default rootReducer;
