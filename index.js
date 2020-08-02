const config = require('./config.js'); //{ config } from './config'
const { processTweet } = require("./textProcessing");
const { Autohook } = require("twitter-autohook");

(async (start) => {
  try {
    const webhook = new Autohook();

    // listen for mentions
    webhook.on("event", async (event) => {
      if (event.tweet_create_events) {
        await didMention(event); // callback function when event triggers
      }
    });

    // Removes existing webhooks
    await webhook.removeWebhooks();

    // Starts a server and adds a new webhook
    await webhook.start();

    // Subscribes to your own user's activity
    await webhook.subscribe({
      oauth_token: process.env.TWITTER_ACCESS_TOKEN,
      oauth_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });
  } catch (e) {
    // Display the error and quit
    console.error(e);
    process.exit(1);
  }
})();

// callback function when event triggers
async function didMention(event) {
  // return if attempting to mention self
  if (event.tweet_create_events[0].user.screen_name === "WhatIsAround") {
    return;
  }

  // save sender information (the person who mentioned me) into an object
  let senderInfo = {
    senderId: undefined,
    senderScreenName: "",
    senderText: "",
    senderLocation: "",
  };

  senderInfo.senderId = event.tweet_create_events[0].user.id;
  senderInfo.text = event.tweet_create_events[0].text;
  senderInfo.senderLocation = event.tweet_create_events[0].user.location;
  senderInfo.senderScreenName = event.tweet_create_events[0].user.screen_name;

  // construct the message to tweet on my feed
  let statusMessageToSend = "";

  // check if location is null
  if (
    senderInfo.senderLocation === "null" ||
    senderInfo.senderLocation === undefined ||
    senderInfo.senderLocation === null
  ){
    statusMessageToSend =
      "Awww, @" +
      senderInfo.senderScreenName +
      ", I need a location in order to work :( Please turn on your location in your Twitter profile to use this bot!";

      // tweet instruction to set location, if not set
      let Twit = require("twit");

      let T = new Twit(config);

      T.post("statuses/update", { status: statusMessageToSend }, function (
        err,
        data,
        response
      ) {
        console.log(data);
      });

  } else { //location is found, retreiving results for response string
    statusMessageToSend =
      "Hello, @" +
      senderInfo.senderScreenName +
      ". You are in " +
      senderInfo.senderLocation + ". I suggest... ";

    let promises = processTweet(senderInfo.text, senderInfo.senderLocation, 2);
    console.log(promises);
    Promise.all(promises)
      .then(function (data) {
        console.log("DATA: ", data);
        if (data.length>0){
          for(list of data){
            for(place of list){
              statusMessageToSend += place + ", "
            }
          }
        }else{ //if retrieval returns no results/no hashtags were present
          statusMessageToSend += "sorry, I couldn't find anything! Try using hashtags like #restaurants or #activities to get recommendations!"
        }
      

        // use the Twit object to handle posting
        let Twit = require("twit");

        let T = new Twit(config);

        T.post("statuses/update", { status: statusMessageToSend }, function (
          err,
          data,
          response
        ) {
          console.log(data);
        });
      });
    }


}

// TO DO:

// Develop logic to check for location

// git checkout master
// git pull
// npm install
// git checkout yourbranch
// git merge master / git pull origin master (may be some merge conflicts...)
// git push
// :wq to exit out of vim (if you happen to get stuck in it)
