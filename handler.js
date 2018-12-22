var { sendResponse, collectData } = require('./utilities');

var actions = {
  'GET': (request, response) => {
    sendResponse(response, 'Hello World', 200, {'Content-Type': 'text/plain'});
  },
  'POST': (request, response) => {
    collectData(request, (formattedData) => {
      // do something with the formatted data e.g. store in db
      sendResponse(response, 'Success', 200, {'Content-Type': 'text/plain'});
    });
  }
};

module.exports = (request, response) => {
  var action = actions[request.method];
  if (action) {
    action(request, response);
  } else {
  // add catch all error handler
    sendResponse(response, "Not Found", 404);
  }
};
