const fs = require('fs');
const path = require('path');

const app_dir = require('./config').app_dir;
let {respond, convertBytes, mimeTypes} = require('./utils/utilities');

// GET, POST and DELETE actions
let actions = {
  'GET': (filepath, request, response) => {
    let fullFilepath = app_dir + filepath;
    let transferredBytes = 0;

    fs.stat(fullFilepath, function(error, stats) {
      // file doesnt exist
      if (error && error.code == "ENOENT") {
        respond(response, 404, '404 File not found.');
      }
      else if (error) {
        // error checking for file
        respond(response, 500, error.toString());
      }
      else if (stats.isDirectory()) {
        console.log('It is a directory');
      }
      else {
        // extract extension and set mimeType
        let ext = path.extname(fullFilepath);
        let mimeType = mimeTypes[ext] || 'text/plain';
        console.log('File to be transferred is:', mimeType);

        // create readStream fromfile path
        let file = fs.createReadStream(decodeURIComponent(fullFilepath));
        // set header
        response.writeHead(200, {"Content-Type": mimeType});

        // streaming with event handlers, data and end events
        file.on('data', function(chunk) {
          transferredBytes += chunk.byteLength;
          response.write(chunk);
        });
        file.on('end', function() {
          console.log(convertBytes(transferredBytes), `(${transferredBytes} bytes)`, 'transferred correctly');
          response.end();
        });
      }
    });
  },

  'POST': (filepath, request, response) => {
    let fullFilepath = app_dir + filepath;
    let transferredBytes = 0;

    fs.stat(fullFilepath, function(err, stat) {
      if (err == null) {
        // file exists
        respond(response, 403, '403 File already exists. Use PUT to update the file.');
      }
      else if (err.code == 'ENOENT') {
        // file doesnt exist
        // create writeStream and handlers
        let outStream = fs.createWriteStream(fullFilepath);
        outStream.on("error", function(error) {
          console.log('error writeStream on error');
        });
        // writable streams have finish event, readable streams have end event
        outStream.on("finish", function() {
          console.log(convertBytes(transferredBytes), `(${transferredBytes} bytes)`, 'written correctly');
        });
        // stream with event handlers
        request.on('data', function(chunk) {
          // on data from client, write it to outStream
          transferredBytes += chunk.byteLength;
          outStream.write(chunk);
        });
        request.on('end', function() {
          // on end from client, close the outStream and send close to client
          outStream.end();
          response.end('Message from server: File written correctly.');
          console.log('connection to client closed');
        });
      }
      else {
        console.log('Error reading file (in POST): ', err.code);
      }
    });
  },

  'DELETE': (filepath, request, response) => {
    let fullFilepath = app_dir + filepath;

    fs.stat(fullFilepath, function(error, stats) {
      if (error && error.code == "ENOENT") {
        // if file doesnt exist
        respond(response, 404, '404 File not found.');
      }
      else if (error) {
        // if there was an error looking for file
        respond(response, 500, error.toString());
      }
      else if (stats.isDirectory()) {
        // if pathname is a directory
        respond(response, 403, '403 You cannot delete a directory.');
      }
      else {
        // delete file from hdd
        fs.unlink(fullFilepath, function(error, file) {
          if (error) {
            respond(response, 500, error.toString());
          }
          else {
            respond(response, 200, 'Message from server: File deleted correctly');
            console.log('File deleted correcly');
          }
        });
      }
    });
  }

};


module.exports = (filepath, request, response) => {
  let action = actions[request.method];
  if (action) {
    action(filepath, request, response);
  } else {
  // add catch all error handler
    respond(response, 404, 'Not Found');
  }
};
