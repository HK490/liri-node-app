require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);
const axios = require("axios");
const moment = require("moment");
const fs = require("fs");
let userOption = process.argv[2];
let userChoice = (process.argv.slice(3).join(""));


switch (userOption) {
    case "concert-this":
        displayConcert(userChoice);
        break;
    case "spotify-this-song":
        displaySong(userChoice);
        break;
    case "movie-this":
        displayMovie(userChoice);
        break;
    case "do-what-it-says":
        displayStated(userChoice);
        break;
};


//`node liri.js concert-this <artist/band name here>`
function displayConcert(userChoice) {
    const queryUrl = "https://rest.bandsintown.com/artists/" + userChoice + "/events?app_id=codingbootcamp";

    axios.get(queryUrl).then(
        function (result) {
            let venue = "Venue Name: " + result.data[0].venue.name
            let location = "Venue Location: " + result.data[0].venue.city + ", " + result.data[0].venue.country
            let date = "Event Date: " + moment(result.data[0].datetime).format('MM-DD-YYYY')

            console.log("\n" + venue + "\n" + location + "\n" + date)
            fs.appendFileSync('log.txt', "\n" + " " + "\n" + venue + "\n" + location + "\n" + date, 'utf8')
        })
        .catch(function (error) {
            console.log(error);
        });
};


//`node liri.js spotify-this-song '<song name here>'`

function displaySong(userChoice) {

    spotify.search({ type: "track", query: userChoice })
        .then(function (result) {

            let artist = "Artist: " + result.tracks.items[0].artists[0].name
            let name = "Name: " + result.tracks.items[0].name
            let link = "Link: " + result.tracks.items[0].preview_url
            let album = "Album: " + result.tracks.items[0].album.name

            console.log("\n" + " " + "\n" + artist + "\n" + name + "\n" + link + "\n" + album)
            fs.appendFileSync('log.txt', "\n" + " " + "\n" + artist + "\n" + name + "\n" + link + "\n" + album, 'utf8')

        })
        .catch(function (error) {
            console.log(error);
        });
};



//`node liri.js movie-this '<movie name here>'`
function displayMovie(userChoice) {
    console.log(userChoice)
    if (!userChoice) {
        userChoice = "Mr.Nobody"
    }
    const queryUrlMovie = "http://www.omdbapi.com/?t=" + userChoice + "&y=&plot=short&apikey=trilogy";

    axios.get(queryUrlMovie).then(
        function (response) {

            let title = "Title: " + response.data.Title
            let year = "Year: " + response.data.Year
            let imdbR = "IMDB Rating: " + response.data.imdbRating
            let tomatoesR = "Rotten Tomatoes Rating: " + response.data.Ratings[1].Value
            let country = "Country Produced: " + response.data.Country
            let lang = "Language: " + response.data.Language
            let plot = "Plot: " + response.data.Plot
            let actors = "Actors: " + response.data.Actors

            console.log("\n" + " " + "\n" + title + "\n" + year + "\n" + imdbR + "\n" + tomatoesR + "\n" + country + "\n" + lang + "\n" + plot + "\n" + actors);
            fs.appendFileSync('log.txt', "\n" + " " + "\n" + title + "\n" + year + "\n" + imdbR + "\n" + tomatoesR + "\n" + country + "\n" + lang + "\n" + plot + "\n" + actors, 'utf8')

        })
        .catch(function (error) {
            console.log(error);
        });
};


//`node liri.js do-what-it-says`

function displayStated(userChoice) {

    fs.readFile("random.txt", "utf8", function (err, data) {

        const dataArr = data.split(",");
        userOption = dataArr[0]
        console.log(userOption)
        userChoice = dataArr[1]
        console.log(userChoice)

        switch (userOption) {
            case "concert-this":
                displayConcert(userChoice);
                break;
            case "spotify-this-song":
                displaySong(userChoice);
                break;
            case "movie-this":
                displayMovie(userChoice);
                break;
            case "do-what-it-says":
                displayStated(userChoice);
                break;

        };

        fs.appendFileSync('log.txt', "\n" + " " + "\n" + userOption + "\n" + userChoice, 'utf8')

    });

};