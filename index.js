// index.js
const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss');

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }
  console.log('It worked! Returned IP:' , ip);

  fetchCoordsByIP(ip, (error, coordinates) => {
    if (error) {
      console.log("It didn't work!" , error);
      return;
    }
  
    console.log('It worked! Returned Coordinates:' , coordinates);
    
    fetchISSFlyOverTimes(coordinates, (error, times) => {
      if (error) {
        console.log("It didn't work!" , error);
        return;
      }
    
      console.log('It worked! Returned times:' , times);
      
    });// End of fetchISSFlyOverTimes
    
  });// End of fetchCoordsByIP

});// End of fetchMyIP