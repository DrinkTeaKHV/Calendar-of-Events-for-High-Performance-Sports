import React from 'react';
import {CircularProgress, createTheme} from "@mui/material";
import {PersistGate} from "redux-persist/integration/react";
import store, {persistor} from './store/store';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import App from './App';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    }
  },
});

const root = ReactDOM.createRoot(document.getElementById("react_root") as HTMLElement);
root.render(
  <Provider store={store}>
    <PersistGate
      loading={<CircularProgress />}
      persistor={persistor}
    >
      <App />
    </PersistGate>
  </Provider>
);
