const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");

exports.mergeVideos = function (req, res) {
  let param = {
    name: req.query.name,
    moment: JSON.parse(req.query.moment),
    interest: req.query.interest,
  };

  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Transfer-Encoding", "chunked");

  const intro = "./assets/clips/videos/petronas-intro.mp4";
  const outro = "./assets/clips/videos/petronas-outro.mp4";
  const dynamicVideo =
    "./assets/clips/AI-footages/Music/Rocking-with-power.mp4";

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
    .on("error", onerror)
    .on("end", onEnd)
    .pipe(res, { end: true });
};

exports.mergeVideosWithAudio = function (req, res) {
  let param = {
    name: req.query.name,
    moment: JSON.parse(req.query.moment),
    interest: req.query.interest,
  };

  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Transfer-Encoding", "chunked");

  const intro = "./assets/clips/videos/petronas-intro.mp4";
  const outro = "./assets/clips/videos/petronas-outro.mp4";
  const dynamicVideo = `./assets/clips/AI-footages/${param.moment.path}`;

  const command = ffmpeg();
  command
    .input(intro)
    .input(outro)
    .input(dynamicVideo)
    .complexFilter([
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
        filter: "concat",
        options: { n: 3, v: 1, a: 1 },
        inputs: ["intro", "0:a", "2:v", "anullsrc=channel_layout=stereo:sample_rate=44100", "outro", "1:a"],
        outputs: ["v", "a"],
      },
    ],["v", "a"])
    .on("error", onerror)
    .on("end", onEnd)
    .format("mp4")
    .outputOptions(["-movflags frag_keyframe+empty_moov"])
    .pipe(res, { end: true });
};

function onerror(err) {
  console.error(err.message);
}

function onEnd() {
  console.log("Video Conversion completed");
}
