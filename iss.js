const request = require('request');

// Makes a single API request to retrieve the user's IP address.
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
    
    const data = JSON.parse(body); // converting body part to object
    callback(null,data.ip);

  });
};// End of fetchMyIP


// Makes a single API request to retrieve the user's geo-coordinates based on an IP address.
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

module.exports = { fetchMyIP, fetchCoordsByIP};