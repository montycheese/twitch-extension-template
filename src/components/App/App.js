import React from 'react';
import PropTypes from 'prop-types';
import Authentication from '../../util/Authentication/Authentication';
import Logger from '../../util/Logger';

import './App.scss';
import TwitchClient from '../../clients/TwitchClient';

const CONFIG_VERSION = '1.0';
const log = Logger.getInstance();

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.authentication = new Authentication();
    this.twitchClient = new TwitchClient(props.newTwitchApiUrl, props.extensionClientId);

    this.ga = function () {};
    this.iOS = /iPad|iPhone|iPod/i.test(navigator.userAgent);

    // if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null.
    this.twitch = window.Twitch ? window.Twitch.ext : null;


    this.state = {
      finishedLoading: false,
      theme: 'light',
      isVisible: true,
      config: null,
      globalConfig: null,
      configFinishedLoading: false,
    };
  }

  contextUpdate(context, delta) {
    if (delta.includes('theme')) {
      this.setState(() => ({ theme: context.theme }));
    }
  }

  // Hook into when player switch to chat on mobile or hit the home button.
  visibilityChanged(isVisible) {
    const newState = { isVisible };

    if (isVisible === false) {
      this.handlePlayerLeaves();
    }

    this.setState(newState);
  }

  componentDidMount() {
    window.addEventListener('load', this.handleRegisterGa);
    document.addEventListener('dblclick', this.handleDoubleClick, { capture: true });

    if (this.twitch) {
      this.twitch.onAuthorized((auth) => {
        //this.authenticationCompleted();
        this.authentication.setToken(auth.token, auth.userId);
        if (!this.state.finishedLoading) {
          this.setState(() => ({
            finishedLoading: true,
          }));
        }
        // You can only get a user's username if they explicitly share their userId with the Twitch Extension.
        if (this.authentication.hasSharedId() && this.authentication.isLoggedIn()) {
          this.twitchClient.getUsers([this.authentication.getUserId(), this.authentication.getChannelId()])
            .then((names) => {
              if (names[0]) {
                this.authentication.setUserName(names[0]);
              }
              if (names[1]) {
                this.authentication.setStreamerUserName(names[1]);
              } else {
                // edge case where streamer is the viewer
                this.authentication.setStreamerUserName(names[0]);
              }
              this.ga('send', 'event', 'Channel', 'View', this.authentication.getStreamerUserName(), 1);
            });
        } else {
          this.twitchClient.getUser(this.authentication.getChannelId())
            .then((userName) => {
              this.authentication.setStreamerUserName(userName);
              this.ga('send', 'event', 'Channel', 'View', userName, 1);
            });
        }
      });

      this.twitch.listen('broadcast', console.log);

      this.twitch.onVisibilityChanged((isVisible) => {
        this.visibilityChanged(isVisible);
      });

      this.twitch.onContext((context, delta) => {
        this.contextUpdate(context, delta);
      });

      this.twitch.configuration.onChanged(this.handleTwitchConfigurationChange);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.handleRegisterGa);
    document.removeEventListener('dblclick', this.handleDoubleClick);

    if (this.twitch) {
      this.twitch.unlisten('broadcast', () => log.info('successfully unlistened'));
    }
  }

  handlePlayerLeaves() {
    log.debug("Player left")
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleViewChange(currentView) {
    this.setState({ currentView });
  }

  // Disable double clicking events because Twitch hooks it into Making the screen full size.
  handleDoubleClick(event) {
    event.stopPropagation();
  }

  handleRegisterGa() {
    this.ga = window.ga || function () {};
  }


  handleTwitchConfigurationChange() {
    /*let config = this.twitch.configuration.broadcaster ? this.twitch.configuration.broadcaster.content : {};
    let globalConfig = this.twitch.configuration.global ? this.twitch.configuration.global.content : {};

    config = new BroadcasterConfig(config);
    globalConfig = new GlobalConfig(globalConfig);
    log.debug(`Config finished loading: broadcaster ${JSON.stringify(config)}, global ${JSON.stringify(globalConfig)}`);
    this.setState({
      config,
      globalConfig,
      configFinishedLoading: true
    }, () => this.authentication.setAllowModStart(config[BroadcasterConfig.configOptions.ALLOW_MOD_START]));
    this.configLoaded();*/
  }
  // end handlers

  render() {
    return (
      <div className="App" />
    );
  }
}

App.propTypes = {
  newTwitchApiUrl: PropTypes.string.isRequired,
  extensionClientId: PropTypes.string.isRequired,
  dev: PropTypes.bool.isRequired, // Whether we are in a development env
  mobile: PropTypes.bool
};

App.defaultProps = {
  mobile: false
};
