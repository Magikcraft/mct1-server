const homedir = require('os').homedir()
const path = require('path')

const mct1WorldDir = `${homedir}/.mct1/worlds`
const mct1PluginDir = `${homedir}/.mct1/plugin`
const myDir = path.resolve(__dirname)
const mct1PluginSrc = path.resolve(`${myDir}/../node_modules/@magikcraft/mct1`)

const downloadUrl =
    'https://sitapatis-sydney-storage.s3.amazonaws.com/MCT1/mct1-worlds-0.1.1.zip'

module.exports = {
    downloadUrl,
    mct1PluginDir,
    mct1PluginSrc,
    mct1WorldDir,
}
