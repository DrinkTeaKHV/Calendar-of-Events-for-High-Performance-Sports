import React from 'react';
import {createTheme, ThemeProvider} from "@mui/material";
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import store from './store/store';
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
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>,
);
