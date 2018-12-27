const fs = require('fs');
const app_dir = require('./../config').app_dir;


module.exports = (filepath) => {
  let files = fs.readdirSync(app_dir);
  if (!files) return false;

  let filename = filepath.slice(1);
  if (files.includes(filename)) {
    console.log('returning true, so it should apply handler');
    return true;
  }

  // try {
  //   console.log('inside!!')
  //   if (filepath == '/') return false;
  //   var stats = fs.statSync(app_dir + filepath);
  //   return true;
  // }
  // catch(err) {
  //     if (err.code == 'ENOENT') return false;
  //     else console.log('There was an error reading pathname');
  // }
}
