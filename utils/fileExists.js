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
}
