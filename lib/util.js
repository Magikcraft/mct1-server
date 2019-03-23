const homedir = require('os').homedir()
const mct1dir = `${homedir}/.mct1/`
const mct1WorldDir = `${mct1dir}/worlds`
const downloadUrl =
    'https://sitapatis-sydney-storage.s3.amazonaws.com/MCT1/mct1-worlds-0.1.1.zip'

module.exports = {
    mct1WorldDir,
    mct1dir,
    downloadUrl,
}
