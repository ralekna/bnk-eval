import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Converter from './converter';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <MuiThemeProvider>
    <Converter />
  </MuiThemeProvider>,
  document.getElementById('root'));
registerServiceWorker();
