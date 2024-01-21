const fs = require('fs');
const path = require('path');

const dirName = path.join(__dirname, 'secret-folder');

fs.readdir(dirName, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  for (const file of files) {
    if (file.isFile()) {
      fs.stat(path.join(dirName, file.name), (err, stats) => {
        if (err) throw err;
        console.log(`${path.parse(file.name).name} - ${path.extname(file.name).slice(1)} - ${(stats.size / 1024).toFixed(3)}kb`);
      });
    }
  }
});