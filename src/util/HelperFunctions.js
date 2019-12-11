export const getRandomElement = (array) => {
  if (!array || !(Array.isArray(array))) {
    throw new Error('Did not provide array to func');
  } else {
    return array[Math.floor(Math.random() * array.length)];
  }
};


/**
 * Returns the number of seconds until a Date
 * @param date A JavaScript Date object
 * @returns {number} time in seconds until the Date
 */
export const getSecondsUntilDate = date => Math.floor((date - Date.now()) / 1000);

// http://localhost:8080/video_overlay.html?anchor=video_overlay&language=en&locale=en-US&mode=viewer&state=testing&platform=web
export const isProduction = () => {
  const queryParams = new URLSearchParams(window.location.search);
  return queryParams.get('state') === 'released';
};

// returns a hex value of a random color. This could be improved in the future if
export const getRandomColor = () => (`#${Math.floor(Math.random() * 16777215).toString(16)}`);
