import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider } from '@emotion/react';
import theme from './style/theme';
import './style/index.css';
import { worker } from './mocks/browser.js';
import { Provider } from 'react-redux';
import configureStore from './store/index.js';

// if (import.meta.env.MODE === 'development') {
//   console.log('worker start');
//   worker.start();
// }
const store = configureStore();

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  // </React.StrictMode>,
);
