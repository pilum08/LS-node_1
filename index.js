const path = require('path');
const fs = require('fs');

const startDir = process.argv[2];
const destinationDir = "./destDir"
if(!destinationDir) {
    fs.mkdir("./destDir")
}
  if (!startDir) {
    console.log('Specify target directory');
    return;
  }


  const readDir = (directory) => {
    fs.readdir(directory, { withFileTypes: true }, (err, files) => {
      files.forEach(file => {
        if (file.isDirectory()) {
          readDir(path.join(directory, file.name));
        } else {
          movingFiles(directory, file.name);
        }
      });
    });
  };
  const createDir = (dir, callback) => {
    fs.stat(dir, (err) => {
      if (err) {
        fs.mkdir(dir, () => {
          if (callback) callback();
        });
      } else {
        if (callback) callback();
      }
    });
  };

  const movingFiles = (directory, filename) => {
    const firstLetter = filename[0].toUpperCase();
    const newPath = path.join(__dirname, destinationDir, firstLetter);
    createDir(newPath, () => {
      fs.link(path.join(directory, filename), path.join(newPath, filename), (err) => {
        if (err) throw err;
      });
    });
  };
  const app = () => {
  createDir(destinationDir);
  readDir(path.join(__dirname, startDir));
  fs.rm(startDir, { recursive: true, force: true }, (err) => {
    if (err) throw err;
  })
};
app();
