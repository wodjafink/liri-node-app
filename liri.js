require("dotenv").config();
var Twitter = require('twitter');
var key = require('./key.js')

var client = new Twitter({
  consumer_key: key.twitter.consumer_key,
  consumer_secret: key.twitter.consumer_secret,
  access_token_key: key.twitter.access_token_key,
  access_token_secret: key.twitter.access_token_secret
});

var params = {screen_name: 'jmednick_tw'};

var doThis = process.argv[2]

switch (doThis)
{
	case "my-tweets":
		console.log("Begin my-tweets")
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
		  if (!error) {
		    tweets.forEach(function(tweet){
		    	console.log(tweet.text)
		    })
		  } else {
		  	console.log(error)
		  }

		});
		break;
	case "spotify-this-song":
		console.log("Begin spotify-this-song")
		break;
	case "movie-this":
		console.log("Begin movie-this")
		break;
	case "do-what-it-says":
		console.log("Begin do-what-it-says")
		break;
	default:
		console.log("Whoops!  You need to give me a command!")
		break;
}
