import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CryptoCurrencyConverter from './converter/CryptoCurrencyConverter';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <MuiThemeProvider>
    <CryptoCurrencyConverter />
  </MuiThemeProvider>, 
  document.getElementById('root'));
registerServiceWorker();
