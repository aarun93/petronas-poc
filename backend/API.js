app.get("/test", async (req, res) => {
    console.log(req.query.enableOpenAi);
  
    //DAL-EE AI IMAGE
    var generatedImage;
    //if(req.query.enableOpenAi == "true"){
    try {
      const completion = await openai.createImage({
        prompt: "fantasy land",
        n: 1,
        size: "1024x1024",
      });
      console.log(completion.data.data[0].url);
      generatedImage = completion.data.data[0].url;
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
    //}
  
    //DAL-EE AI IMAGE
  
    // const inputVideo = "sample-5s.mp4";
    // const inputImage = "5847e7a1cef1014c0b5e480f.png";
    // // const inputImage = "https://cdn.fstoppers.com/styles/full/s3/media/2019/12/04/nando-jpeg-quality-screenshot_dsc-hv400v.jpg";
    // const outputVideo = "./output-test.mp4";
  
    // const command = ffmpeg();
    // const fs = require("fs");
  
    // command.input(inputVideo);
    // // command.input(inputImage);
    // command.input(generatedImage || inputImage);
    // command.input("out.mp4");
  
    // command.complexFilter(
    //   [
    //     {
    //       filter: "drawtext",
    //       options: {
    //         fontfile: "test.ttf",
    //         text: req.query.displayText,
    //         fontcolor: "red",
    //         fontsize: "72",
    //         y:"h-100*t"
    //       },
    //       inputs: "0:v",
    //       outputs: "textoutput",
    //     },
  
    //     {
    //       filter: "overlay",
    //       options: {
    //         x: 400,
    //         y: 25,
    //       },
    //       inputs: ["textoutput", "1:v"],
    //       outputs: "filtered",
    //     },
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
    //   ],
    //   "filtered"
    // );
  
    // command
    //   .output(outputVideo)
    //   .videoCodec("libx264")
    //   .audioCodec("copy")
    //   .on("error", function (err) {
    //     console.log("An error occurred: " + err.message);
    //   })
    //   .on("end", function () {
    //     const outputFilePath = `${__dirname}/output-test.mp4`;
    //     const output = fs.createReadStream(outputFilePath);
    //     output.on("open", () => {
    //       res.set("Content-Type", "video/mp4");
    //       output.pipe(res);
    //     });
    //     output.on("error", (err) => {
    //       console.error(err);
    //       res.status(500).send("Error sending response");
    //     });
    //   })
    //   .run();
  });