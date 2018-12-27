const http = require('http');
const url = require('url');
const fs = require('fs');
// const { sendResponse, collectData } = require('./utilities');
const handler = require('./handler');
const staticServer = require('./utils/staticServer');
const fileExists = require('./utils/fileExists');
const app_dir = require('./config').app_dir;

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
}).listen(8000, () => {
  console.log('Server started on port 8000...');
});
