const url = require('url');
const fs = require('fs');
const path = require('path');

// maps file extention to MIME types
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

function static(req, res) {
  const parsedUrl = url.parse(req.url);
  var pathname = path.join(__dirname, '../public', parsedUrl.pathname);
  var pathname = decodeURIComponent(pathname);
  console.log(pathname)

  if (req.url == '/') {
    pathname += 'index.html';
  }
  fs.exists(pathname, function (exist) {
    if(!exist) {
      // if the file is not found, return 404
      res.statusCode = 404;
      res.end(`File not found!`);
      return;
    }
    // read file from file system
    fs.readFile(pathname, function(err, data){
      if(err){
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        // based on the URL path, extract the file extention. e.g. .js, .doc, ...
        const ext = path.parse(pathname).ext;
        // if the file is found, set Content-type and send data
        res.setHeader('Content-type', mimeTypes[ext] || 'text/plain' );
        res.end(data);
      }
    });
  });
}

module.exports = static;
