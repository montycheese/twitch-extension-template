import React from 'react';
import PropTypes from 'prop-types';
import Authentication from '../../util/Authentication/Authentication';
import './Config.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logger from '../../util/Logger';
import BroadcasterConfig from '../../util/BroadcasterConfig';
import { Trans } from 'react-i18next';
import { COLOR_HEX, LINKS } from '../../util/Constants';
import { ButtonToolbar } from 'react-bootstrap';

const log = Logger.getInstance();
const CONFIG_VERSION = '1.0';
export default class ConfigPage extends React.Component {
  constructor(props) {
    super(props);
    this.Authentication = new Authentication();

    // if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null.
    this.twitch = window.Twitch ? window.Twitch.ext : null;
    this.state = {
      finishedLoading: false,
      configFinishedLoading: false,
      theme: 'light',
      config: null
    };

    this.handleConfigUpdate = this.handleConfigUpdate.bind(this);
  }

  componentDidMount() {
    // do config page setup as needed here
    if (this.twitch) {
      this.twitch.onAuthorized((auth) => {
        this.Authentication.setToken(auth.token, auth.userId);
        if (!this.state.finishedLoading) {
          // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.

          // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
          this.setState(() => ({ finishedLoading: true }));
        }
      });

      this.twitch.configuration.onChanged(() => {
        let config = this.twitch.configuration.broadcaster ? this.twitch.configuration.broadcaster.content : '';
        config = new BroadcasterConfig(config);
        this.setState({
          config,
          configFinishedLoading: true
        });
      });
    }
  }

  handleConfigUpdate(config) {
    const updatedConfig = this.state.config.newConfigFromUpdate(config);
    try {
      this.twitch.configuration.set('broadcaster', CONFIG_VERSION, updatedConfig.toJson());
    } catch (e) {
      return Promise.reject(e);
    }
    this.setState({ config: updatedConfig });
    return Promise.resolve();
  }

  render() {

    return (
      <div className="Config">
        <div className="Config-light">
          {"No config needed"}
        </div>
      </div>
    );
  }
}


ConfigPage.propTypes = {
  sengageWSApiUrl: PropTypes.string.isRequired,
  sengageHttpApiUrl: PropTypes.string.isRequired,
  dev: PropTypes.bool.isRequired // Whether we are in a development env
};
