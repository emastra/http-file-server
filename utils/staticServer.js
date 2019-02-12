const url = require('url');
const fs = require('fs');
const path = require('path');
const mimeTypes = require('./mimeTypes');

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
