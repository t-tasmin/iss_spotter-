const request = require('request');

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
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
    
    const data = JSON.parse(body); // converting body part to object
    callback(null,data.ip);

  });
};// End of fetchMyIP

/**
 * Makes a single API request to retrieve the user's user's geo-coordinates based on an IP address.
 * Input:
 *   - A callback (to pass back an error or the coordinates)
 *   - IP Adreess
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The Coordinates as an object (null if error).
 **/

const fetchCoordsByIP = function(ip, callback) {
  const web = "https://freegeoip.app/json/" + ip;
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
    
    const data = JSON.parse(body); // converting body part to object
    callback(null,{latitude:data.latitude, longitude:data.longitude});
  });
};// End of fetchCoordsByIP;

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  const web = "https://iss-pass.herokuapp.com/json/?lat=" + coords.latitude + "&lon=" + coords.longitude;
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
    
    const data = JSON.parse(body); // converting body part to object
    callback(null, data.response);

  });
};// End of fetchISSFlyOverTimes


/**
//module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
 const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

// Only export nextISSTimesForMyLocation and not the other three (API request) functions.
// This is because they are not needed by external modules.
module.exports = { nextISSTimesForMyLocation };