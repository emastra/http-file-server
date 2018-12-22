let sendResponse = (response, data, statusCode, headers) => {
  response.writeHead(statusCode, headers);
  response.end(data);
};

let collectData = (request, callback) => {
  var data = '';
  request.on('data', (chunk) => {
    data += chunk;
  });
  request.on('end', () => {
    callback(data);
  });
};

module.exports = {
  sendResponse,
  collectData
};
