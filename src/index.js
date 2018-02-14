import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Converter from './converter/Converter';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Converter />,
  document.getElementById('root'));
registerServiceWorker();
