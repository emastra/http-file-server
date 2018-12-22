let http = require('http');
let url = require('url');
let { sendResponse, collectData } = require('./utilities');
let handler = require('./handler');

let routes = {
  '/': handler,
  '/allFiles': handler
};

let server = http.createServer(function(request, response) {
  let parts = url.parse(request.url);
  let route = routes[parts.pathname];
  if (route) {
    route(request, response);
  } else {
    sendResponse(response, "Not found", 404);
  }
}).listen(8000, () => {
  console.log('Server started on port 8000...');
});
