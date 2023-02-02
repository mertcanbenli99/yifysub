
const { subtitleIdRegex } = require('./constants');
const constants = require('./constants');

 function findSearchString(responseData) {
    const data = JSON.stringify(responseData);
    const startsAt = data.match(constants.imdbRegex);
    return startsAt;
    
}

 function findSubtitleUrl(responseData, movieTitle, language) {
    const data = JSON.stringify(responseData);

    const subtitleId = data.match(subtitleIdRegex.source.replace('english', language));
    const movieName = movieTitle.toLowerCase().split(" ").join("-");
    const zipURL = `${constants.subtitleUrl}${movieName}-${subtitleId}.zip`;
    return zipURL;
    
}

module.exports = {findSearchString, findSubtitleUrl};
