const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const short = require("short-uuid");
const fs = require("fs");
const path = require("path");

exports.mergeVideos = function (req, res) {
  let param = {
    name: req.query.name,
    moment: JSON.parse(req.query.moment),
    interest: req.query.interest,
  };

  res.setHeader("Content-Type", "video/mp4");

  const intro = "./assets/clips/videos/petronas-intro.mp4";
  const outro = "./assets/clips/videos/petronas-outro.mp4";
  const dynamicVideo = `./assets/clips/AI-footages/${param.moment.path}`;
  const videoId = short.generate();
  const outputVideo = `./output/${videoId}.mp4`;

  const command = ffmpeg();
  command.input(intro).input(outro).input(dynamicVideo)
  command.complexFilter(
    [
      {
        filter: "drawtext",
        options: {
          fontfile: "./assets/fonts/TiltWarp-Regular.ttf",
          text: param.moment.description,
          fontcolor: "white",
          fontsize: "60",
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
          fontsize: "32",
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
          text: param.name,
          fontcolor: "white",
          fontsize: "60",
          alpha:
            "if(lt(t,0),0,if(lt(t,0.5),(t-0)/0.5,if(lt(t,1.5),1,if(lt(t,2),(0.5-(t-1.5))/0.5,0))))",
          x: "(w-text_w)/2",
          y: "(h-text_h)/2.1",
        },
        inputs: "1:v",
        outputs: "outro",
      },
      {
        filter: "trim",
        options: {
          start: 0,
          end: 10,
        },
        inputs: "2:v",
        outputs: "trimed",
      },
      {
        filter: "concat",
        options: {
          n: 3,
          v: 1,
          a: 0,
        },
        inputs: ["intro", "trimed", "outro"],
        outputs: ["vout"],
      },
    ],
    ["vout"]
  );

  command
    .format("mp4")
    .output(outputVideo)
    .on("error", onerror)
    .on("end", function () {
      addAudio(outputVideo,videoId,res);
    })

    // .outputOptions(["-movflags frag_keyframe+empty_moov"])  //Uncomment for stream the video
    .run();
};

exports.mergeVideosWithAudio = function (req, res) {
  let param = {
    name: req.query.name,
    moment: JSON.parse(req.query.moment),
    interest: req.query.interest,
  };

  res.setHeader("Content-Type", "video/mp4");
  // res.setHeader("Transfer-Encoding", "chunked");

  const intro = "./assets/clips/videos/petronas-intro.mp4";
  const outro = "./assets/clips/videos/petronas-outro.mp4";
  const dynamicVideo = `./assets/clips/AI-footages/${param.moment.path}`;
  const outputVideo = `./output/${short.generate()}-output.mp4`;

  const command = ffmpeg();
  command
    .input(intro)
    .input(outro)
    .input(dynamicVideo)
    .complexFilter(
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
            text: param.name,
            fontcolor: "white",
            fontsize: "80",
            alpha:
              "if(lt(t,0),0,if(lt(t,0.5),(t-0)/0.5,if(lt(t,1.5),1,if(lt(t,2),(0.5-(t-1.5))/0.5,0))))",
            x: "(w-text_w)/2",
            y: "(h-text_h)/2.1",
          },
          inputs: "1:v",
          outputs: "outro",
        },
        {
          filter: "trim",
          options: {
            start: 0,
            end: 10,
          },
          inputs: "2:v",
          outputs: "trimed",
        },
        {
          filter: "concat",
          options: { n: 3, v: 1, a: 1 },
          inputs: [
            "intro",
            "0:a",
            "trimed",
            "anullsrc=channel_layout=stereo:sample_rate=44100",
            "outro",
            "1:a",
          ],
          outputs: ["v", "a"],
        },
      ],
      ["v", "a"]
    )
    .on("error", onerror)
    .on("end", function () {
      const outputFilePath = path.join(__dirname, "../", outputVideo);
      const stat = fs.statSync(outputFilePath);
      const fileSize = stat.size;
      res.setHeader("Content-Length", fileSize);
      const output = fs.createReadStream(outputFilePath);
      output.pipe(res);
      output.on("end", () => {
        onend(outputFilePath);
      });
    })
    .format("mp4")
    .output(outputVideo)
    // .outputOptions(["-movflags frag_keyframe+empty_moov"])  //Uncomment for stream the video
    .run();
};

function onerror(err) {
  console.error(err.message);
}

function onend(fileUrl) {
  fs.unlink(fileUrl, (err) => {
    if (err) {
      console.log(`Error deleting file: ${err}`);
    } else {
      console.log("File deleted successfully.");
    }
  });
}

function addAudio(file,videoId,res){
  const command = ffmpeg();
  command
  .input(file)
  .input('./assets/clips/audio/Stylish-Rock-short.aac')
  .outputOptions('-c', 'copy', '-to', '25')
  .on("end", function () {
    const outputFilePath = path.join(__dirname, "../", `./output/${videoId}-withAudio.mp4`);
    const stat = fs.statSync(outputFilePath);
    const fileSize = stat.size;
    res.setHeader("Content-Length", fileSize);
    const output = fs.createReadStream(outputFilePath);
    output.pipe(res);
    output.on("end", () => {
      onend(path.join(__dirname, "../", file))
      onend(outputFilePath);
    });
  })
  .output(`./output/${videoId}-withAudio.mp4`)
  .run();
}
