const homedir = require('os').homedir()
const mct1WorldDir = `${homedir}/.mct1/worlds`
const downloadUrl =
    'https://sitapatis-sydney-storage.s3.amazonaws.com/MCT1/mct1-worlds-0.1.1.zip'

module.exports = {
    mct1WorldDir,
    downloadUrl,
}
