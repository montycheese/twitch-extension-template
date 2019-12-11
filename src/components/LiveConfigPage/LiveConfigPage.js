import React from 'react';
import PropTypes from 'prop-types';
import Authentication from '../../util/Authentication/Authentication';
import '../App/App.scss';

import './LiveConfigPage.scss';
import Logger from '../../util/Logger';
import TwitchClient from '../../clients/TwitchClient';
import i18n from 'i18next';


const log = Logger.getInstance();

export default class LiveConfigPage extends React.Component {
  constructor(props) {
    super(props);
    this.authentication = new Authentication();

    this.twitchClient = new TwitchClient(props.newTwitchApiUrl, props.extensionClientId);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleRegisterGa = this.handleRegisterGa.bind(this);
    // if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null.
    this.twitch = window.Twitch ? window.Twitch.ext : null;
    this.ga = function () {};
    this.state = {
      finishedLoading: false,
      theme: 'light',
    };
  }

  contextUpdate(context, delta) {
    if (delta.includes('theme')) {
      this.setState(() => ({ theme: context.theme }));
    }
  }

  componentDidMount() {
    window.addEventListener('load', this.handleRegisterGa);
    if (this.twitch) {
      this.twitch.onAuthorized((auth) => {
        this.authentication.setToken(auth.token, auth.userId);
        if (!this.state.finishedLoading) {
          // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.

          // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
          this.setState(() => ({ finishedLoading: true }));

          // You can only get a user's username if they explicitly share their userId with the Twitch Extension.
          if (this.authentication.hasSharedId() && this.authentication.isLoggedIn()) {
            this.twitchClient.getUser(this.authentication.getUserId())
              .then((userName) => {
                this.authentication.setUserName(userName);
                this.authentication.setStreamerUserName(userName);
              });
          }
        }
      });

      this.twitch.listen('broadcast', console.log);

      this.twitch.onContext((context, delta) => {
        this.contextUpdate(context, delta);
      });
    }
  }

  componentWillUnmount() {
    if (this.twitch) {
      this.twitch.unlisten('broadcast', () => console.log('successfully unlistened'));
    }
  }


  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }


  handleRegisterGa() {
    this.ga = window.ga || function () {};
  }


  render() {
    return (
      <div className="LiveConfigPage" />
    );
  }
}

LiveConfigPage.propTypes = {
  newTwitchApiUrl: PropTypes.string.isRequired,
  extensionClientId: PropTypes.string.isRequired,
};
