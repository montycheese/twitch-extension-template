import $ from 'jquery';
import Logger from '../util/Logger';

const log = Logger.getInstance();

/**
 * Promise based Twitch Client
 */
export default class TwitchClient {
  constructor(newApiUrl, clientId) {
    this._newApiUrl = newApiUrl;
    this._clientId = clientId;
  }

  /**
   * @see https://dev.twitch.tv/docs/api/reference/#get-users
   *
   * @param userId The id of the user to fetch information about from Twitch
   * @returns A Promise that either resolves with the String username corresponding to the user id
   *          or rejects with the error if the call fails.
   */
  getUser(userId) {
    return $.ajax({
      url: `${this._newApiUrl}?id=${userId}`,
      headers: this._getHeaders(),
    }).then((response) => {
      const { data } = response;
      if (data && data.length > 0) {
        const user = data[0];
        log.debug(`Fetched username ${user.display_name} for userId ${userId}`);
        return Promise.resolve(user.display_name);
      }
      log.error(`Could not fetch username from twitch for userid: ${userId}`);

      return Promise.reject(new Error('Failed to fetch user_name for user'));
    });
  }

  /**
   * @see https://dev.twitch.tv/docs/api/reference/#get-users
   *
   * @param userId The id of the user to fetch information about from Twitch
   * @returns A Promise that either resolves with the array of usernames corresponding to the user id
   *          or rejects with the error if the call fails. Dedupes usernames, so if both IDs are the same, it will return one thing only.
   */
  getUsers(userIds) {
    return $.ajax({
      url: this._buildUserIdQueryParams(this._newApiUrl, userIds),
      headers: this._getHeaders(),
    }).then((response) => {
      const { data } = response;
      if (data && data.length > 0) {
        const displayNames = data.map(user => user.display_name);
        log.debug(`Fetched usernames ${displayNames}`);
        return Promise.resolve(displayNames);
      }
      log.error(`Could not fetch username from twitch for userid: ${userId}`);

      return Promise.reject(new Error('Failed to fetch user_name for user'));
    });
  }

  _buildUserIdQueryParams(url, ids) {
    if (ids.length === 0) {
      return url;
    } if (ids.length === 1) {
      return `${url}?id=${ids[0]}`;
    }

    url += `?id=${ids[0]}`;

    let i = 1;
    while (i < ids.length) {
      url += `&id=${ids[i]}`;
      i++;
    }

    return url;
  }

  _getHeaders() {
    return { 'Client-ID': this._clientId };
  }
}
