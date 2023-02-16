
const bodyParser = require('body-parser');
const express = require('express');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

var app = express();
ffmpeg.setFfmpegPath(ffmpegPath);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

var port = 9000;

app.post('/', function(req, res) {
    console.log('receiving data ...');
    console.log('body is ', req.body);
    

    var proc = ffmpeg('sample-5s.mp4')
    .videoFilters({
  filter: 'drawtext',
  options: {
    fontfile:'test.ttf',
    text: 'Hi Halim very good',
    fontsize: 20,
    fontcolor: 'white',
    x: '(main_w/2-text_w/2)',
    y: 150,
    shadowcolor: 'black',
    shadowx: 2,
    shadowy: 2
  }
}).on('end', function () {
        console.log('file has been generated succesfully');
    })
    .on('error', function (err, stdout, stderr) {
        console.log('an error happened: ' +err);
        console.log('an error happened: ' + stdout,stderr);

    })
    // save to file
    .save('./out.mp4');
    res.send("what up boiiii");
});


// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);





