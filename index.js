const bodyParser = require("body-parser");
const express = require("express");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");

var app = express();
ffmpeg.setFfmpegPath(ffmpegPath);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var port = 9000;

app.post("/", function (req, res) {
  var proc = ffmpeg("sample-5s.mp4")
    .videoFilters({
      filter: "drawtext",
      options: {
        fontfile: "test.ttf",
        text: "this should be draw to video ",
        fontsize: 20,
        fontcolor: "red",
        x: "(main_w/2-text_w/2)",
        y: 150,
        shadowcolor: "black",
        shadowx: 2,
        shadowy: 2,
      },
    })
    .on("end", function () {
      console.log("file has been generated succesfully");
    })
    .on("error", function (err, stdout, stderr) {
      console.log("an error happened: " + err);
      console.log("an error happened: " + stdout, stderr);
    })
    // save to file
    .save("./out.mp4");
  res.send("what up boiiii");
});

app.get("/test", (req, res) => {
  const inputVideo = "sample-5s.mp4";
  const inputImage = "5847e7a1cef1014c0b5e480f.png";
  // const inputImage = "https://cdn.fstoppers.com/styles/full/s3/media/2019/12/04/nando-jpeg-quality-screenshot_dsc-hv400v.jpg";
  const outputVideo = "./output-test.mp4";

  const command = ffmpeg();
  const fs = require("fs");

  command.input(inputVideo);
  command.input(inputImage);

  command.complexFilter(
    [
      {
        filter: "drawtext",
        options: {
          fontfile: "test.ttf",
          text: "Hello",
          fontcolor: "red",
          fontsize: "72",
          enable: "gte(t,3)",
          x: 100,
          y: 100,
        },
        inputs: "0:v",
        outputs: "textoutput",
      },
      {
        filter: "overlay",
        options: {
          x: 215,
          y: 25,
        },
        inputs: ["textoutput", "1:v"],
        outputs: "filtered",
      },
    ],
    " filtered"
  );

  command
    .output(outputVideo)
    .videoCodec("libx264")
    .audioCodec("copy")
    .on("error", function (err) {
      console.log("An error occurred: " + err.message);
    })
    .on("end", function () {
      console.log("file has been generated succesfully");
      const outputFilePath = `${__dirname}/output-test.mp4`;
      const output = fs.createReadStream(outputFilePath);
      output.on("open", () => {
        res.set("Content-Type", "video/mp4");
        output.pipe(res);
      });
      output.on("error", (err) => {
        console.error(err);
        res.status(500).send("Error sending response");
      });
    })
    .run();
});

// start the server
app.listen(port);
console.log("Server started! At http://localhost:" + port);
