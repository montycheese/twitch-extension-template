import React from 'react';
import ReactDOM from 'react-dom';
import ConfigPage from './components/ConfigPage/ConfigPage';
import './locale/i18n';

ReactDOM.render(
  <ConfigPage
    dev={process.env.DEV}
  />,
  document.getElementById('root'),
);
