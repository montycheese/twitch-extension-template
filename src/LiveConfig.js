import React from 'react';
import ReactDOM from 'react-dom';
import LiveConfigPage from './components/LiveConfigPage/LiveConfigPage';
import './locale/i18n';

ReactDOM.render(
  <LiveConfigPage
    newTwitchApiUrl={process.env.NEW_TWITCH_API_URL}
    extensionClientId={process.env.EXT_CLIENT_ID}
    dev={process.env.DEV}
  />,
  document.getElementById('root'),
);
