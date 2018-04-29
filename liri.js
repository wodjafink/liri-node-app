require("dotenv").config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api')
var key = require('./key.js')

var client = new Twitter({
  consumer_key: key.twitter.consumer_key,
  consumer_secret: key.twitter.consumer_secret,
  access_token_key: key.twitter.access_token_key,
  access_token_secret: key.twitter.access_token_secret
});

var spotify = new Spotify({
	id: key.spotify.id,
	secret: key.spotify.secret
})

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
		if (process.argv[3]) {
			// Search for the query defined by the user
			spotify.search({ type: 'track', query: process.argv[3] }, function(err, data) {
	  			if (err) {
	    			return console.log('Error occurred: ' + err);
	  			}

	  			data.tracks.items.forEach(function(item){
	  				if (item.name === process.argv[3]){  					
		  				console.log("Artists: ")
		  				item.artists.forEach(function(artist){
		  					console.log("\t * " + artist.name)
		  				})
		  				console.log("Track: " + item.name)
		  				console.log("Preview: " + item.preview_url)
		  				console.log("Album Name: " + item.album.name)
	  				}
	  			})
			});
		} else {
			// Default is to return "The Sign" by Ace of Base
			spotify.search({ type: 'track', query: 'The Sign' }, function(err, data) {
	  			if (err) {
	    			return console.log('Error occurred: ' + err);
	  			}

	  			data.tracks.items.forEach(function(item){
	  				if (item.name === "The Sign"){  					
		  				console.log("Artists: ")
		  				item.artists.forEach(function(artist){
		  					console.log("\t * " + artist.name)
		  				})
		  				console.log("Track: " + item.name)
		  				console.log("Preview: " + item.preview_url)
		  				console.log("Album Name: " + item.album.name)
	  				}
	  			})
			});
		}
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
