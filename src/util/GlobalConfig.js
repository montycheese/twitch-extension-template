import Logger from './Logger';

const log = Logger.getInstance();

/**
 * Wrapper class that holds the global config values and defaults.
 */
export default class GlobalConfig {
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
    const newConfig = new GlobalConfig(this.toJson());
    Object.values(GlobalConfig.configOptions).forEach((val) => {
      if (updatedConfig[val] !== undefined) {
        newConfig[val] = updatedConfig[val];
      }
    });
    return newConfig;
  }
}

GlobalConfig.configOptions = {
};
