/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require('request');
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API

  const web = "https://api.ipify.org?format=json";

  request(web, function(error, response, body) {
    if (error) {
      callback(error, null);
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    //console.log('statusCode:', response && response.statusCode);
    const data = JSON.parse(body); // converting body part to object
    callback(null,data.ip);

  });
};

module.exports = { fetchMyIP };