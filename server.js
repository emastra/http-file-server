var http = require('http');

var handler = require('./handler');

var server = http.createServer(handler)
  .listen(8000, () => {
  console.log('Server started on port 8000...');
});
