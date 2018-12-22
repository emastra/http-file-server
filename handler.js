module.exports = (request, response) => {
  if (request.method === 'GET') {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello, World!');
  } else if (request.method === 'POST') {
    var data = '';
    request.on('data', (chunk) => {
      data += chunk;
    });
    request.on('end', () => {
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end('Success');
    });
  }
};
