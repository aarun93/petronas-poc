const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const { Configuration, OpenAIApi } = require("openai");
const metadata = require("./assets/json/metadata.json");
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

  let param = {
    name: req.query.name,
    moment: JSON.parse(req.query.moment),
    interest: req.query.interest,
  };

  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Transfer-Encoding", "chunked");

  const intro = "./assets/clips/videos/petronas-intro.mp4";
  const outro = "./assets/clips/videos/petronas-outro.mp4";
  const dynamicVideo = "./assets/clips/AI-footages/Music/Rocking-with-power.mp4";

  const command = ffmpeg();

  command.input(intro);
  command.input(dynamicVideo);
  command.input(outro);
  command.complexFilter(
    [
      {
        filter: "drawtext",
        options: {
          fontfile: "./assets/fonts/TiltWarp-Regular.ttf",
          text: param.moment.description,
          fontcolor: "white",
          fontsize: "80",
          alpha:
            "if(lt(t,0),0,if(lt(t,0.5),(t-0)/0.5,if(lt(t,2.5),1,if(lt(t,3),(0.5-(t-2.5))/0.5,0))))",
          x: "(w-text_w)/2",
          y: "(h-text_h)/2",
        },
        inputs: "0:v",
        outputs: "powermoment1",
      },
      {
        filter: "drawtext",
        options: {
          fontfile: "./assets/fonts/TiltWarp-Regular.ttf",
          text: `By ${param.name}`,
          fontcolor: "white",
          fontsize: "40",
          alpha:
            "if(lt(t,0),0,if(lt(t,0.5),(t-0)/0.5,if(lt(t,2.5),1,if(lt(t,3),(0.5-(t-2.5))/0.5,0))))",
          x: "(w-text_w)/2",
          y: "(h-text_h)/1.7",
        },
        inputs: "powermoment1",
        outputs: "intro",
      },
      {
        filter: "drawtext",
        options: {
          fontfile: "./assets/fonts/TiltWarp-Regular.ttf",
          text: " ",
          fontcolor: "red",
          fontsize: "80",
          alpha:
            "if(lt(t,0),0,if(lt(t,0.5),(t-0)/0.5,if(lt(t,1.5),1,if(lt(t,2),(0.5-(t-1.5))/0.5,0))))",
          x: "(w-text_w)/2",
          y: "(h-text_h)/2.1",
        },
        inputs: "1:v",
        outputs: "dynamic",
      },
      {
        filter: "drawtext",
        options: {
          fontfile: "./assets/fonts/TiltWarp-Regular.ttf",
          text: param.name,
          fontcolor: "white",
          fontsize: "80",
          alpha:
            "if(lt(t,0),0,if(lt(t,0.5),(t-0)/0.5,if(lt(t,1.5),1,if(lt(t,2),(0.5-(t-1.5))/0.5,0))))",
          x: "(w-text_w)/2",
          y: "(h-text_h)/2.1",
        },
        inputs: "2:v",
        outputs: "outro",
      },
      {
        filter: "concat",
        options: {
          n: 3,
          v: 1,
          a: 0,
        },
        inputs: ["intro", "dynamic", "outro"],
        outputs: "out",
      },
    ],
    "out"
  );

  command
    .videoCodec("libx264")
    .audioCodec("copy")
    .format("mp4")
    .outputOptions(["-movflags frag_keyframe+empty_moov"])
    .on("error", function (err) {
      console.log(`An error occurred: ${err.message}`);
    })
    .on("end", function () {
      console.log("Video Conversion completed");
    })
    .pipe(res, { end: true });
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
