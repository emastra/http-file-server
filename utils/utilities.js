const respond = (res, status, data, type) => {
  res.writeHead(status, {
    "Content-Type": type || "text/plain"
  });
  res.end(data);
};

const convertBytes = (x) => {
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let l = 0, n = parseInt(x, 10) || 0;
  while(n >= 1024 && ++l)
    n = n/1024;
  return(n.toFixed(n >= 10 || l < 1 ? 0 : 1) + ' ' + units[l]);
}

const mimeTypes = {
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

module.exports = {
  respond,
  convertBytes,
  mimeTypes
}
