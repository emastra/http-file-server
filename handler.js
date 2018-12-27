const fs = require('fs');
const app_dir = require('./config').app_dir;
const path = require('path');

var { sendResponse, collectData } = require('./utilities');

var respond = (res, status, data, type) => {
  res.writeHead(status, {
    "Content-Type": type || "text/plain"
  });
  res.end(data);
};

var bytesTrans = 0;
function niceBytes(x) {
  // the result differs from what linux file property shows. Check this function math
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let l = 0, n = parseInt(x, 10) || 0;
  while(n >= 1024 && ++l)
      n = n/1024;
  return(n.toFixed(n >= 10 || l < 1 ? 0 : 1) + ' ' + units[l]);
}

const mimeTypes = {
  // Extension to MIME Type
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.eot': 'appliaction/vnd.ms-fontobject',
  '.ttf': 'aplication/font-sfnt',
  '.mp4': 'video/mp4'
};



var actions = {
  'GET': (filepath, request, response) => {
    var fullpathfile = app_dir + filepath;

    fs.stat(fullpathfile, function(error, stats) {
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
        var ext = path.extname(fullpathfile);
        var mimeType = mimeTypes[ext] || 'text/plain';
        console.log('File to be transferred is:', mimeType);

        // create readStream fromfile path
        var file = fs.createReadStream(decodeURIComponent(fullpathfile));
        // set header
        response.writeHead(200, {"Content-Type": mimeType});

        // streaming with event handlers, data and end events
        file.on('data', function(chunk) {
          bytesTrans += chunk.byteLength;
          response.write(chunk);
        });
        file.on('end', function() {
          console.log(niceBytes(bytesTrans), `(${bytesTrans} bytes)`, 'transferred correctly');
          response.end();
        });
      }
    });
  },

  'POST': (filepath, request, response) => {
    // collectData(request, (formattedData) => {
    //   // do something with the formatted data e.g. store in db
    //   sendResponse(response, 'Success', 200, {'Content-Type': 'text/plain'});
    // });
    var fullpathfile = app_dir + filepath;
    fs.stat(fullpathfile, function(err, stat) {
      if (err == null) {
        // file exists
        respond(response, 403, '403 File already exists. Use PUT to update the file.');
      }
      else if (err.code == 'ENOENT') {
        // file doesnt exist
        // create writeStream and handlers
        console.log('file doesnt exist!!!!!!!', 'outstream in', fullpathfile)
        var outStream = fs.createWriteStream(fullpathfile);
        outStream.on("error", function(error) {
          console.log('error writeStream on error');
        });
        // writable streams have finish event, readable streams have end event
        outStream.on("finish", function() {
          console.log(niceBytes(bytesTrans), `(${bytesTrans} bytes)`, 'written correctly');
        });
        // stream with event handlers
        request.on('data', function(chunk) {
          // on data from client, write it to outStream
          bytesTrans += chunk.byteLength;
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
    var fullpathfile = app_dir + filepath;

    fs.stat(fullpathfile, function(error, stats) {
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
        fs.unlink(fullpathfile, function(error, file) {
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
  var action = actions[request.method];
  if (action) {
    action(filepath, request, response);
  } else {
  // add catch all error handler
    sendResponse(response, "Not Found", 404);
  }
};
