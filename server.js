const http = require('http');
const url = require('url');
const fs = require('fs');
const handler = require('./handler');
const staticServer = require('./utils/staticServer');
const fileExists = require('./utils/fileExists');
const app_dir = require('./config').app_dir;
// set port to heroku environment variable OR default to 3000
const port = process.env.PORT || 3000;

const routes = {
  '/api/allFiles': (request, response) => {
    fs.readdir(app_dir, function(error, files) {
      if (error) {
        response.writeHead(500, {'Content-Type': 'text/plain'});
        response.end(error.toString());
      }
      else {
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write(files.join('\n'));
        response.end();
      }
    });
  }
};

const server = http.createServer(function(request, response) {
  let parsedURL = url.parse(request.url);
  let route = routes[parsedURL.pathname];
  let filepath = decodeURIComponent(parsedURL.pathname);

  if (route) {
    route(request, response);
  } else if (fileExists(filepath) || request.method == 'POST') {
    handler(filepath, request, response);
  } else {
    staticServer(request, response);
  }
}).listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
