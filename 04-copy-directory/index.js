const fs = require('fs').promises;
const path = require('path');

const dir1 = path.join(__dirname, 'files');
const dir2 = path.join(__dirname, 'files-copy');

// fs.mkdir(dir2, { recursive: true }, (err) => {
//   if (err) throw err;
// });

// fs.readdir(dir2, (err, files) => {
//   if (err) throw err;
//   for (const file of files) {
//     fs.unlink(path.join(dir2, file), (err) => {
//       if (err) throw err;
//     });
//   }
// });dir2

// fs.readdir(dir1, (err, files) => {
//   if (err) throw err;
//   for (const file of files) {
//     fs.copyFile( path.join(dir1, file), path.join(dir2, file), (err) => {
//       if (err) throw err;
//     }
//     );
//   }
// });

async function copyFolder(dir1, dir2) {
  try {
    await fs.rm(dir2, { force: true, recursive: true });
    await fs.mkdir(dir2, { recursive: true });
    const files = await fs.readdir(dir1, { withFileTypes: true }, (error, files) => files);
    files.forEach((file) => {
      fs.copyFile(path.join(dir1, file.name), path.join(dir2, file.name));
    });
  } catch (err) {
    throw err;
  }
}

copyFolder(dir1, dir2);