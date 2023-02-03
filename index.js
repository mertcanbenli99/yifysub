#!/usr/bin/env node

const yargs = require("yargs");
const guessit = require("guessit-exec");
const axios = require("axios");
const fs = require("fs");
const stream = require("stream");
const util = require("util");
const unzipper = require("unzipper");
const urlConstants = require("./constants");
const stringUtils = require("./utils");
const constants = require("./constants");

const argv = yargs
  .command("download", "Download a file", (yargs) => {
    yargs
      .option("language", {
        alias: "l",
        describe: "Language of the file to download",
        default: "english",
      })
      .positional("filename", {
        describe: "Name of the file to download",
        demandOption: true,
        type: "string",
        
      });
  })
  .demandCommand(1, "You need at least one command before moving on")
  .help().argv;

const fileName = argv._[1]; // parse command line argument and get fileName
const language = argv.language;


guessit(fileName)
  .then(async (data) => {
    const responseData = await getData(`${constants.searchUrl}${data.title}`);
    const searchString = stringUtils.findSearchString(responseData);
   
    

    const response = await getData(`${constants.baseUrl}${searchString}`);
   

    const subtitleURL = stringUtils.findSubtitleUrl(response, data.title, language);
   
    
   


    await getSubtitle(subtitleURL, fileName);
    await extractFile(`${fileName}.zip`, "./");
    process.stdout.write('true');
  })
  .catch((e) => console.log(e));

async function getData(url) {
  try {
    const response = await axios.get(url);

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

async function getSubtitle(url, movieName) {
  const pipeline = util.promisify(stream.pipeline);
  try {
    const request = await axios.get(url, {
      responseType: "stream",
    });
    await pipeline(request.data, fs.createWriteStream(`${movieName}.zip`));
    console.log("subtitle download successfull");
  } catch (error) {
    console.error("download  pipeline failed", error);
  }
}

async function extractFile(filePath, extractPath) {
  const readStream = fs.createReadStream(filePath);
  await new Promise((resolve, reject) => {
    readStream
      .pipe(unzipper.Extract({path: extractPath}))
      .on("close", resolve)
      .on("error", reject);
  });
  console.log("Subtitle zip extracted successfully!");
  try {
    await util.promisify(fs.unlink)(`${fileName}.zip`);
    console.log(`${fileName}.zip was deleted`);
  } catch (err) {
    console.error(err);
  }
}
