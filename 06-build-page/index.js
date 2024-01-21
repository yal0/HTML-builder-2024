const fs = require('fs');
const path = require('path');

const dirProject = path.join(__dirname, 'project-dist');

async function build() {
  await fs.mkdir(dirProject, { recursive: true }, async (err) => {
    if (err) throw err;
  });

  await fs.copyFile(
    path.join(__dirname, 'template.html'),
    path.join(dirProject, 'index.html'),
    async (err) => {
      if (err) throw err;
    }
  );
  let templateData = '';
  const readTemplate = fs.createReadStream(
    path.resolve(dirProject, 'index.html'),
    'utf-8'
  );

  await readTemplate.on('data', (data) => {
    templateData = data;
  });

  await readTemplate.on('end', async () => {
    await fs.readdir(
      path.resolve(__dirname, 'components'),
      { withFileTypes: true },
      async (err, files) => {
        if (err) throw err;
        for await (const file of files) {
          let componentData = '';
          let componentName = file.name.replace(/\.[a-z]+$/, '');
          const readComponent = fs.createReadStream(
            path.resolve(__dirname, 'components', file.name),
            'utf-8'
          );

          await readComponent.on('data', async (data) => {
            componentData = data;
          });

          await readComponent.on('end', async () => {
            templateData = templateData.replace(
              '{{' + componentName + '}}',
              componentData
            );
            const writeIndex = fs.createWriteStream(
              path.resolve(dirProject, 'index.html')
            );
            writeIndex.write(templateData);
          });
        }
      }
    );
  });

  await fs.readdir(
    path.join(__dirname, 'styles'),
    { withFileTypes: true },
    async (err, files) => {
      const output = fs.createWriteStream(path.join(dirProject, 'style.css'));
      if (err) throw err;
      for await (const file of files) {
        if (
          file.isFile() &&
          path.extname(path.join(__dirname, 'styles', file.name)) === '.css'
        ) {
          const pathToFile = path.join(__dirname, 'styles', file.name);
          const input = fs.createReadStream(pathToFile, 'utf-8');
          await input.pipe(output);
        }
      }
    }
  );

  await copyAssets();
}

async function copyAssets() {
  const source = path.resolve(__dirname, 'assets');
  const destination = path.resolve(dirProject, 'assets');
  async function copyFiles(source, destination) {
    await fs.stat(source, async (err, stats) => {
      if (err) throw err;
      if (stats.isDirectory()) {
        await fs.mkdir(destination, { recursive: true }, async (err) => {
          if (err) throw err;
        });
        await fs.readdir(source, async (err, folder) => {
          if (err) throw err;
          for await (const file of folder) {
            await copyFiles(
              path.join(source, file),
              path.join(destination, file)
            );
          }
        });
      } else {
        await fs.copyFile(source, destination, (err) => {
          if (err) throw err;
        });
      }
    });
  }
  await copyFiles(source, destination);
}

build();