
const { subtitleIdRegex } = require('./constants');
const constants = require('./constants');

 function findSearchString(responseData) {
    const data = JSON.stringify(responseData);
    const startsAt = data.match(constants.imdbRegex);
    return startsAt;
    
}

 function findSubtitleUrl(responseData, movieTitle, language) {
    const data = JSON.stringify(responseData);
    const regex = new RegExp(subtitleIdRegex.source.replace('english', language),'g')
    
    const subtitleIds = data.match(regex);
  
    
    const movieName = movieTitle.toLowerCase().split(" ").join("-");
    const zipURLS =  subtitleIds.map((element) => `${constants.subtitleUrl}${movieName}-${element}.zip`);
    return zipURLS;
    
}

module.exports = {findSearchString, findSubtitleUrl};
