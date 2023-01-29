const constants = require('./constants');

 function findSearchString(responseData) {
    const data = JSON.stringify(responseData);
    const startsAt = data.search(constants.imdbRegex);
    const searchString = data.slice(startsAt, startsAt + 20);
    return searchString;
}

 function findSubtitleUrl(responseData, movieTitle) {
    const data = JSON.stringify(responseData);
   

    const subtitleId = data.match(constants.subtitleIdRegex);
    const movieName = movieTitle.toLowerCase().split(" ").join("-");
    const zipURL = `${constants.subtitleUrl}${movieName}-${subtitleId}.zip`;
    return zipURL;
    
}

module.exports = {findSearchString, findSubtitleUrl};
