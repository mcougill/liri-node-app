require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");

var userCommand = process.argv[2];

//variable to feed to randomTxtFunc
var randomtxt;

//switch case for 4 command line arguments
switch (userCommand) {
    case "my-tweets":
        twitterFunc();
        break;

    case "spotify-this-song":
        spotifyFunc();
        break;

    case "movie-this":
        movieFunc();
        break;

    case "do-what-it-says":
        randomTxtFunc();
        break;
}

//function for my-tweets
function twitterFunc() {
    var Twitter = require("twitter");
    var client = new Twitter(keys.twitter);

    var userName = { screen_name: "molcoug" };
    client.get("statuses/user_timeline", userName, function (error, tweets, response) {
        if (!error) {
            console.log("Here are my recent tweets:");
            console.log("");

            for (i = 0; i < 20; i++) {
                console.log(tweets[i].text);
                console.log("Tweeted at: " + tweets[i].created_at);
                console.log("");
            }
        } else {
            console.log(error);
        }
    })
}








//function for spotify-this-song
function spotifyFunc() {
    var Spotify = require("node-spotify-api");
    var spotify = new Spotify(keys.spotify);
    var song = randomtxt;

    if (song == null) {
        song = process.argv[3];

        //accounts for multiword inputs
        for (i = 4; i < process.argv.length; i++) {
            song = song + " " + process.argv[i];
        }
    }

    if (song == null) {
        console.log("Didn't want to enter a song? How about The Sign by Ace of Base!");
        song = "The Sign";
    }
    spotify.search({ type: "track", query: song }, function (err, data) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("");
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Song Name: " + data.tracks.items[0].name);
        console.log("Preview Link: " + data.tracks.items[0].preview_url);
        console.log("Album: " + data.tracks.items[0].album.name);
    });
}



//function for movie-this
function movieFunc() {


    var request = require("request");
    var movie = randomtxt;

    if (movie == null) {
        movie = process.argv[3];

        //accounts for multiword inputs
        for (i = 4; i < process.argv.length; i++) {
            movie = movie + " " + process.argv[i];
        }
    }

    if (movie == null) {
        console.log("Didn't want to enter a movie? How about Mr. Nobody!");
        movie = "Mr. Nobody";
    }
    var queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy"

    request(queryURL, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("");
            // Title of the movie.
            console.log("Title: " + JSON.parse(body)["Title"]);
            //   Year the movie came out.
            console.log("Release Year: " + JSON.parse(body)["Year"]);
            //   IMDB Rating of the movie.
            console.log("IMDB Rating: " + JSON.parse(body)["imdbRating"]);
            //   Rotten Tomatoes Rating of the movie.
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body)["Ratings"][1].Value);
            //   Country where the movie was produced.
            console.log("Country Produced: " + JSON.parse(body)["Country"]);
            //   Language of the movie.
            console.log("Language: " + JSON.parse(body)["Language"]);
            //   Plot of the movie.
            console.log("Plot: " + JSON.parse(body)["Plot"]);
            //   Actors in the movie.
            console.log("Actors: " + JSON.parse(body)["Actors"]);
        }
        else {
            console.log(error);
        }
    });

}



//do-what-it-says function
function randomTxtFunc() {
    
    fs.readFile("random.txt", "utf8", function (error, data) {

        var dataArr = data.split(", ");

        userCommand = dataArr[0];


        if (dataArr.length > 0) {
            randomtxt = dataArr[1];
        }

        switch (userCommand) {
            case "my-tweets":
                twitterFunc();
                break;
            case "spotify-this-song":
                spotifyFunc();
                break;
            case "movie-this":
                movieFunc();
                break;
        }
    });
}