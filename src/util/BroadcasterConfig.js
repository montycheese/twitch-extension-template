import Logger from './Logger';

const log = Logger.getInstance();

/**
 * Wrapper class that holds the broadcaster's config values and defaults.
 */
export default class BroadcasterConfig {
  constructor(configJson) {
    let config = {};
    try {
      config = JSON.parse(configJson);
    } catch (e) {
      log.error('Failed to parse config Json', e);
    }
  }

  toJson() {
    return JSON.stringify(this);
  }

  newConfigFromUpdate(updatedConfig) {
    const newConfig = new BroadcasterConfig(this.toJson());
    Object.values(BroadcasterConfig.configOptions).forEach((val) => {
      if (updatedConfig[val] !== undefined) {
        newConfig[val] = updatedConfig[val];
      }
    });
    return newConfig;
  }
}

BroadcasterConfig.configOptions = {

};
