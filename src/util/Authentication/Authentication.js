const jwt = require('jsonwebtoken');

/**
 * Helper class for authentication against an EBS service. Allows the storage of a token to be accessed across componenents.
 * This is not meant to be a source of truth. Use only for presentational purposes.
 */
export default class Authentication {
  constructor(token, opaqueId) {
    this._token = token;
    this._opaqueId = opaqueId;
    this._userId = null;
    this._role = null;
    this._userName = null;
    this._channelId = null;
    this._streamUserName = null;
    this.allowModStart = true;
  }

  isLoggedIn() {
    return this._opaqueId[0] === 'U';
  }

  // This does guarantee the user is a moderator- this is fairly simple to bypass - so pass the JWT and verify
  // server-side that this is true. This, however, allows you to render client-side UI for users without
  // holding on a backend to verify the JWT.
  // Additionally, this will only show if the user shared their ID, otherwise it will return false.
  isModerator() {
    return this._role === 'moderator';
  }

  isBroadcaster() {
    return this._role === 'broadcaster';
  }

  canStartGame() {
    if (this.allowModStart) {
      return this.isBroadcaster() || this.isModerator();
    }
    return this.isBroadcaster();
  }

  // defines where a moderator can start a stream minigame, based on a broadcaster's configuration
  setAllowModStart(allowModStart) {
    this.allowModStart = allowModStart;
  }

  // similar to mod status, this isn't always verifiable, so have your backend verify before proceeding.
  hasSharedId() {
    return this._userId !== null && this._userId !== undefined && this._userId !== '';
  }

  getUserId() {
    return this._userId;
  }

  getChannelId() {
    return this._channelId;
  }

  setStreamerUserName(name) {
    this._streamerUserName = name;
  }

  getStreamerUserName() {
    return this._streamerUserName;
  }

  getOpaqueId() {
    return this._opaqueId;
  }

  getRole() {
    return this._role;
  }

  // set the token in the authentication component state
  // this is naive, and will work with whatever token is returned. under no circumstances should you use this
  // logic to trust private data- you should always verify the token on the backend before displaying that data.
  setToken(token, opaqueId) {
    let role = '';
    let userId = '';

    try {
      const decoded = jwt.decode(token);
      userId = decoded.user_id;
      role = decoded.role;
      this._token = token;
      this._opaqueId = opaqueId;
      this._channelId = decoded.channel_id;
    } catch (e) {
      this._token = '';
      this._opaqueId = '';
    }
    this._userId = userId;
    this._role = role;
  }

  getToken() {
    return this._token;
  }

  getUserName() {
    return this._userName;
  }

  setUserName(userName) {
    this._userName = userName;
  }

  // checks to ensure there is a valid token in the state
  isAuthenticated() {
    return this._token && this._opaqueId;
  }

  /**
     * Makes a call against a given endpoint using a specific method.
     *
     * Returns a Promise with the Request() object per fetch documentation.
     *
     */

  makeCall(url, method = 'GET') {
    return new Promise((resolve, reject) => {
      if (this.isAuthenticated()) {
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this._token}`,
        };

        fetch(url,
          {
            method,
            headers,
          })
          .then(response => resolve(response))
          .catch(e => reject(e));
      } else {
        reject(new Error('Unauthorized'));
      }
    });
  }
}
