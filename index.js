//import { config } from './config'

let Twit = require('twit');
let T = new Twit({
  consumer_key:         'zQaz9GMUnHzpCFznd7OUFDZSQ',
  consumer_secret:      'v9effAGA6bMAiqrElT3EeAOuls4CN82iStTvHAxBz4X6t9YvbA',
  access_token:         '1105793491576090624-wKBfi5zPLWQabA1BKWyQyVdqHdU1e6',
  access_token_secret:  'rDM8SrfegCoHklBZNR653hURwPNt9jksVRQ3NdjwzvYyR',
});
let users = ["1665950887"];
let stream = T.stream('statuses/filter', {follow: users});
stream.on('tweet', function (tweet) {
    if (users.indexOf(tweet.user.id_str) > -1) {
        console.log(tweet.user.name + ": " + tweet.text);
        T.post('statuses/retweet/:id', { id: tweet.id_str }, function (err, data, response) {
            console.log(data)
        })
    }
})