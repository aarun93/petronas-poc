const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const { Configuration, OpenAIApi } = require("openai");
const metadata = require('./assets/json/metadata.json');
require('dotenv').config()
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

app.post("/", async function (req, res) {
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
  
    try {
      const completion = await openai.createImage({
        prompt: "one horse",
        n: 1,
        size: "1024x1024",
      })
      console.log(completion.data.data[0].url);
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
  
  //res.send(response);
   // res.send("test");
})

app.get("/test", async(req, res) => {

  console.log(req.query.enableOpenAi);

  //DAL-EE AI IMAGE
  var generatedImage;
  if(req.query.enableOpenAi == "true"){
    try {
      const completion = await openai.createImage({
        prompt: req.query.prompt,
        n: 1,
        size: "1024x1024",
      })
      console.log(completion.data.data[0].url);
      generatedImage = completion.data.data[0].url
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
  }
  
  //DAL-EE AI IMAGE


  const inputVideo = "sample-5s.mp4";
  const inputImage = "5847e7a1cef1014c0b5e480f.png";
  // const inputImage = "https://cdn.fstoppers.com/styles/full/s3/media/2019/12/04/nando-jpeg-quality-screenshot_dsc-hv400v.jpg";
  const outputVideo = "./output-test.mp4";

  const command = ffmpeg();
  const fs = require("fs");

  command.input(inputVideo);
  // command.input(inputImage);
  command.input(generatedImage || inputImage);
  command.input("out.mp4");

  command.complexFilter(
    [
      {
        filter: "drawtext",
        options: {
          fontfile: "test.ttf",
          text: req.query.displayText,
          fontcolor: "red",
          fontsize: "72",
          y:"h-100*t"
        },
        inputs: "0:v",
        outputs: "textoutput",
      },
      
      {
        filter: "overlay",
        options: {
          x: 400,
          y: 25,
        },
        inputs: ["textoutput", "1:v"],
        outputs: "filtered",
      },
      // {
      //   filter: "overlay",
      //   options: {
      //     x: 250,
      //     y: 100,
      //   },
      //   inputs: ["filtered", "2:v"],
      //   outputs: "merged",
      // },
      // {
      //   filter: "concat",
      //   options: {
      //     n: 2, 
      //     v: 1, 
      //     a: 0,
      //   },
      //   inputs: ["filtered", "2:v"],
      //   outputs: "concatenated",
      // },
    ],
    "filtered"
  );

  command
    .output(outputVideo)
    .videoCodec("libx264")
    .audioCodec("copy")
    .on("error", function (err) {
      console.log("An error occurred: " + err.message);
    })
    .on("end", function () {
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

app.get("/petronas", async(req, res) => {

  let param = {
    name:"Harshal Bagul",
    moment:"Making Big Moves With Big Beats"
  }

  const intro = "./assets/clips/videos/introvideo.mp4";
  const outro = "./assets/clips/videos/outrovideo.mp4";
  const dynamicVideo = "./assets/clips/AI-footages/Music/dynamicvideo.mp4";
  const powermomentout = "./output-test.mp4";

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
          text: param.moment,
          fontcolor: "white",
          fontsize: "80",
          alpha:'if(lt(t,0),0,if(lt(t,0.5),(t-0)/0.5,if(lt(t,2.5),1,if(lt(t,3),(0.5-(t-2.5))/0.5,0))))',
          x:"(w-text_w)/2",
          y:"(h-text_h)/2"
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
          alpha:'if(lt(t,0),0,if(lt(t,0.5),(t-0)/0.5,if(lt(t,2.5),1,if(lt(t,3),(0.5-(t-2.5))/0.5,0))))',
          x:"(w-text_w)/2",
          y:"(h-text_h)/1.7"
        },
        inputs: "powermoment1",
        outputs: "intro",
      },
      {
        filter: "drawtext",
        options: {
          fontfile: "./assets/fonts/TiltWarp-Regular.ttf",
          text: 'I',
          fontcolor: "red",
          fontsize: "80",
          alpha:'if(lt(t,0),0,if(lt(t,0.5),(t-0)/0.5,if(lt(t,1.5),1,if(lt(t,2),(0.5-(t-1.5))/0.5,0))))',
          x:"(w-text_w)/2",
          y:"(h-text_h)/2.1"
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
          alpha:'if(lt(t,0),0,if(lt(t,0.5),(t-0)/0.5,if(lt(t,1.5),1,if(lt(t,2),(0.5-(t-1.5))/0.5,0))))',
          x:"(w-text_w)/2",
          y:"(h-text_h)/2.1"
        },
        inputs: "2:v",
        outputs: "outro",
      },
      {
        filter: 'concat',
        options: {
          n: 3,
          v: 1,
          a: 0,
        },
        inputs: ['intro', 'dynamic' ,'outro'],
        outputs: 'out'
      }
    ],
    "out"
  );

  command
    .output(powermomentout)
    .videoCodec("libx264")
    .audioCodec("copy")
    .on("error", function (err) {
      console.log("An error occurred: " + err);
    })
    .on("progress", function (info) {
      console.log("My info - : " + JSON.stringify(info));
    })
    .on("end", function () {
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

app.get("/metadata",(req,res)=>{
  try{
    res.status(200).json(metadata);
  }catch(e){
    res.status(501);
  }
})

// start the server
app.listen(port);
console.log("Server started! At http://localhost:" + port);
