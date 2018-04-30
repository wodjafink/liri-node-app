require("dotenv").config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api')
var request = require('request')
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

function movieEntry(name, formattedName){
	this.name = name;
	this.formattedName = formattedName;
	this.ID = "";
	this.year = "";
	this.imdbRating = "";
	this.rottenTomatoesRating = "";
	this.country = "";
	this.language = "";
	this.plot = "";
	this.actors = "";

	this.setID = function(ID){
		this.ID = ID;
	}

	this.setYear = function(year){
		this.year = year;
	}

	this.setimdbRating = function(imdbRating){
		this.imdbRating = imdbRating;
	}

	this.setRottenTomatoesRating = function(rating){
		this.rottenTomatoesRating = rating;
	}

	this.setCountry = function(country){
		this.country = country;
	}

	this.setLanguage = function(language){
		this.language = language;
	}

	this.setPlot = function(plot){
		this.plot = plot;
	}

	this.setActors = function(actors){
		this.actors = actors;
	}

	this.displayMovie = function(){
		console.log("Title: " + this.name);
		console.log("Year: " + this.year)
		console.log("IMDB Rating: " + this.imdbRating);
		console.log("Rotten Tomatoes Score: " + this.rottenTomatoesRating)
		console.log("Countries where produced: " + this.country);
		console.log("Language(s): " + this.language)
		console.log("Plot: " + this.plot)
		console.log("Actors: " + this.actors)
	}
}

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
		if (process.argv[3]){
			var userMovieEntry = new movieEntry(process.argv[3], process.argv[3].replace(/ /g,"-"));
			request('http://www.omdbapi.com/?apikey=trilogy&s=' + userMovieEntry.formattedName, function(err, response, body){
	  			if (err) {
	    			return console.log('Error occurred: ' + err);
	  			}
	  			var movies = JSON.parse(body);
	  			movies.Search.forEach(function(movie){
	  				if (movie.Title === userMovieEntry.name){
	  					userMovieEntry.setYear(movie.Year);
	  					userMovieEntry.setID(movie.imdbID);
						request('http://www.omdbapi.com/?apikey=trilogy&i=' + userMovieEntry.ID, function(err, response, body){
							if (err) {
				    			return console.log('Error occurred: ' + err);
				  			}
				  			var imdbMovie = JSON.parse(body);
				  			userMovieEntry.setimdbRating(imdbMovie.imdbRating);
				  			if (imdbMovie.Ratings[1] != undefined){
					  			userMovieEntry.setRottenTomatoesRating(imdbMovie.Ratings[1].Value)
				  			} else {
				  				userMovieEntry.setRottenTomatoesRating(" No Rating Sorry! ")
				  			}
				  			userMovieEntry.setCountry(imdbMovie.Country);
				  			userMovieEntry.setLanguage(imdbMovie.Language)
				  			userMovieEntry.setPlot(imdbMovie.Plot)
				  			userMovieEntry.setActors(imdbMovie.Actors)
							userMovieEntry.displayMovie();
							return;
						})
						//Adding a return here to only print one movie
						return;
	  				}
	  			})
			})
		} else {
			var defaultMovieEntry = new movieEntry('Mr. Nobody', 'Mr-Nobody');
			request('http://www.omdbapi.com/?apikey=trilogy&s=' + defaultMovieEntry.formattedName, function(err, response, body){
	  			if (err) {
	    			return console.log('Error occurred: ' + err);
	  			}
	  			var movies = JSON.parse(body);
	  			movies.Search.forEach(function(movie){
	  				if ((movie.Title === "Mr. Nobody") && (movie.Year === '2009')){
	  					defaultMovieEntry.setYear(movie.Year);
	  					defaultMovieEntry.setID(movie.imdbID);
						request('http://www.omdbapi.com/?apikey=trilogy&i=' + defaultMovieEntry.ID, function(err, response, body){
							if (err) {
				    			return console.log('Error occurred: ' + err);
				  			}
				  			var imdbMovie = JSON.parse(body);
				  			defaultMovieEntry.setimdbRating(imdbMovie.imdbRating);
				  			defaultMovieEntry.setRottenTomatoesRating(imdbMovie.Ratings[1].Value)
				  			defaultMovieEntry.setCountry(imdbMovie.Country);
				  			defaultMovieEntry.setLanguage(imdbMovie.Language)
				  			defaultMovieEntry.setPlot(imdbMovie.Plot)
				  			defaultMovieEntry.setActors(imdbMovie.Actors)
							defaultMovieEntry.displayMovie();
						})
	  				}
	  			})
			})
		}
		break;
	case "do-what-it-says":
		console.log("Begin do-what-it-says")
		break;
	default:
		console.log("Whoops!  You need to give me a command!")
		break;
}
