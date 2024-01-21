const fs = require('fs');
const path = require('path');

const dir1 = path.join(__dirname, 'files');
const dir2 = path.join(__dirname, 'files-copy');

fs.mkdir(dir2, { recursive: true }, (err) => {
  if (err) throw err;
});

fs.readdir(dir2, (err, files) => {
  if (err) throw err;
  for (const file of files) {
    fs.unlink(path.join(dir2, file), (err) => {
      if (err) throw err;
    });
  }
});

fs.readdir(dir1, (err, files) => {
  if (err) throw err;
  for (const file of files) {
    fs.copyFile( path.join(dir1, file), path.join(dir2, file), (err) => {
      if (err) throw err;
    }
    );
  }
});