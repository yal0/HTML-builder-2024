const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css')
);
const styleDir = path.join(__dirname, 'styles');

fs.readdir(styleDir, { withFileTypes: true }, async (err, files) => {
  if (err) throw err;
  for await (const file of files) {
    if (
      file.isFile() &&
      path.extname(path.join(styleDir, file.name)) === '.css'
    ) {
      const pathToFile = path.join(styleDir, file.name);
      const input = fs.createReadStream(pathToFile, 'utf-8');
      input.pipe(output);
    }
  }
});