import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import './locale/i18n';

ReactDOM.render(
  <App
    newTwitchApiUrl={process.env.NEW_TWITCH_API_URL}
    extensionClientId={process.env.EXT_CLIENT_ID}
    dev={process.env.DEV}
    mobile
  />,
  document.getElementById('root'),
);
