const express = require("express");
const path = require("path");
const axios = require("axios");
const qs = require("querystring"); //built-in querystring module for manipulating query strings

//UNCOMMENT THE FOLLOWING TWO LINES IF USING SSL CERTS
//const fs = require("fs"); //file r/w module built-in to Node.js
//const https = require("https"); //built-in https module

const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || "8888";

const trakt = "https://api.trakt.tv";

let urlObject = {
  page: 1,
  limit: 15
}

let parsedQuery = qs.stringify(urlObject);


//LOCAL SSL CERTS
/* var opts = {
  ca: [fs.readFileSync("<path_to_rootkey>"), fs.readFileSync("<path_to_rootpem")],
  key: fs.readFileSync("<path_to_key>"),
  cert: fs.readFileSync("<path_to_crt>")
}; */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
//set up static path (for use with CSS, client-side JS, and image files)
app.use(express.static(path.join(__dirname, "public")));


//app routes
app.get("/", (req, res) => {
  getTrendingMovies(res);
});

app.get("/popular", (req, res) => {
  getPopularMovies(res);
})

// for trakt listening
app.get("/authorize", (req, res) => {
  
});

//HTTP server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
/*
//HTTPS server (comment out the HTTP server listening and uncomment 
//this section to use HTTPS (you need SSL certs)
var server = https.createServer(opts, app);

server.listen(port, () => {
  console.log(`Listening on https://localhost:${port}`);
});
*/

/**
 * Function to make a request to retrieve trending movies
 * then render on the page.
 * 
 * @param {Response} res The Response for the page to be used for rendering.
 */
function getTrendingMovies(res) {
  axios(
    {
      url: `${trakt}/movies/trending`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "trakt-api-version": 2,
        "trakt-api-key": process.env.TRAKT_CLIENT_ID
      }
    }
    ).then(function (response) {
      //console.log(response.data);
      res.render("index", { title: "Home", movies: response.data });
    }).catch(function (error) {
      console.log(error);
  });
}

/**
 * Function to make a request to retrieve popular movies
 * then render on the page.
 * 
 * @param {Response} res The Response for the page to be used for rendering.
 */
 function getPopularMovies(res) {
  axios(
    {
      url: `${trakt}/shows/popular?${parsedQuery}`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "trakt-api-version": 2,
        "trakt-api-key": process.env.TRAKT_CLIENT_ID
      }
    }
    ).then(function (response) {
      //console.log(response.data);
      res.render("popular", { title: "Popular movies", topmovies: response.data });
    }).catch(function (error) {
      console.log(error);
  });
}



