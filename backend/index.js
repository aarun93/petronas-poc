const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const { Configuration, OpenAIApi } = require("openai");
const metadata = require("./assets/json/metadata.json");
const ffmpegControler = require('./controller/ffmpeg-controller');
require("dotenv").config();
const fs = require("fs");

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);
var app = express();
ffmpeg.setFfmpegPath(ffmpegPath);
app.use(cors());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var port = 9000;

app.get("/", async function (req, res) {
  const intro =
    "https://storage.googleapis.com/petronas-d1a58.appspot.com/assets/clips/videos/petronas-intro.mp4?GoogleAccessId=firebase-adminsdk-7zx0q%40petronas-d1a58.iam.gserviceaccount.com&Expires=1702310400&Signature=TxNHi86s7XSYbwV2Dg7IYkoAzpz62O1WwnCIdIxOotKR4ixdIxZyKVgdSqJ0TOXJkMzT9xSOpAWfdLSIqLb4ir2%2B%2FnN62XeV3Z5B4ticoPJFc4B%2Fap%2FAp7j3rBGfJUoDcHMnkZGEIjmjSgKrxHFLJnVgStIHDqjaGJLTxNsh7bCtyl4ZoTxN2eO6ZQfIPEclfhc3oR7BpjdXBnmWnJLONqzvBHO1TOzkf%2FjTDGFg3QnMr8zBtzDeQUKEhFo7ddVyLHhb7wq7qCJQLZyq8xL14s2ObCApMlegXEY0fbvJC3pKlppR7KemjXhMPjYHqqjvo8PQmG7ZiTL1S3JRr8iYDQ%3D%3D";

  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Transfer-Encoding", "chunked");

  var proc = ffmpeg()
    .input(intro)
    .videoFilters({
      filter: "drawtext",
      options: {
        fontfile: "./assets/fonts/TiltWarp-Regular.ttf",
        text: "This should be draw to video ",
        fontsize: 20,
        fontcolor: "red",
        x: "(main_w/2-text_w/2)",
        y: 150,
        shadowcolor: "black",
        shadowx: 2,
        shadowy: 2,
      },
    })
    .format("mp4")
    .outputOptions(["-movflags frag_keyframe+empty_moov"])
    .on("error", function (err, stdout, stderr) {
      console.log("an error happened: " + err);
      console.log("an error happened: " + stdout, stderr);
    })
    .on("end", function () {
      console.log("file has been generated succesfully");
    })
    .pipe(res, { end: true });
});

app.get("/petronas", async (req, res) => {
  console.log("Video Generation starts");
  ffmpegControler.mergeVideosWithAudio(req, res);

});

app.get("/metadata", (req, res) => {
  console.log("Metadata Served:");
  try {
    res.status(200).json(metadata);
  } catch (e) {
    res.status(501);
  }
});

// start the server
app.listen(port);
console.log("Server started! At http://localhost:" + port);
