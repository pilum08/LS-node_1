const path = require('path')
const fs = require('fs')
const { resolve } = require('path')
const { rejects } = require('assert')

const startDir = process.argv[2]
const destinationDirParam = process.argv[3]
const destinationDir = "./destDir"
const keepStartDir = process.argv[4]
if (destinationDirParam === 'Auto') {
  fs.mkdirSync(destinationDir)
}else if(!destinationDirParam){
  console.log('Specify destination directory or enter "Auto"');
  return
}
if (!startDir) {
  console.log('Specify target directory')
  return
}

const readDir =async (base, level) => {
  const files = fs.readdirSync(base)

  files.forEach(async (item) => {
    let localBase = path.join(base, item)
    let state = fs.statSync(localBase)
    let fileName = path.basename(item)
    let dirname = fileName[0].toUpperCase()
    if (state.isDirectory()) {
      await readDir(localBase, level + 1)
    } else {
     await createDir(fileName)
     await movingFiles(base, dirname, fileName)
    }

  })
}

const createDir = async (fileName) => {
  const firstLetter = fileName[0].toUpperCase()
  const dirname = `${firstLetter}`
  const dirPath = path.join(__dirname, destinationDir, dirname)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
  }
}

const movingFiles =async (dir, dirName, fileName) => {
  const oldPath = path.join(__dirname, dir, fileName)
  const newPath = path.join(__dirname, destinationDir, dirName, fileName)
  fs.linkSync(oldPath, newPath, (err) => {
    console.log(err)
  })
}
const  removeDir = async() => {
  fs.rm(startDir, { recursive: true, force: true }, (err) => {
    if (err) throw err
  })
}
if (keepStartDir!=='keep'){
  removeDir()
}
readDir(startDir, 0)
