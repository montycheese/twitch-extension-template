import { isProduction } from './HelperFunctions';

const nullLogger = () => {};

export default class Logger {
  constructor() {
    this._loggingToConsole = !isProduction();
    if (isProduction()) {
      this._log = nullLogger;
    } else if (!window || !window.Twitch || !window.Twitch.ext || !window.Twitch.ext.rig || !window.Twitch.ext.rig.log) {
      console.error('Could not find dev rig logger');
      this._log = this._loggingToConsole ? console.log : nullLogger;
    } else {
      // log to both console and dev rig if we're not in prod.
      this._log = window.Twitch.ext.rig.log;
    }
  }

  debug(...args) {
    if (this._loggingToConsole) {
      console.debug(args);
    }
    this._log('[DEBUG]:', JSON.parse(JSON.stringify(args)));
  }

  info(...args) {
    if (this._loggingToConsole) {
      console.log(args);
    }
    this._log(JSON.parse(JSON.stringify(args)));
  }

  warn(...args) {
    if (this._loggingToConsole) {
      console.warn(args);
    }
    this._log('[WARN]:', JSON.parse(JSON.stringify(args)));
  }

  error(...args) {
    if (this._loggingToConsole) {
      console.error(args);
    }
    this._log('[ERROR]:', JSON.parse(JSON.stringify(args)));
  }
}

Logger._instance = null;

Logger.getInstance = () => {
  if (Logger._instance !== null) {
    return Logger._instance;
  }
  Logger._instance = new Logger();
  return Logger._instance;
};
