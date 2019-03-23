const homedir = require('os').homedir()
const path = require('path')

const mct1WorldDir = `${homedir}/.mct1/worlds`
const mct1PluginDir = `${homedir}/.mct1/plugin`
const myDir = path.resolve(__dirname)
const mct1PluginSrc = path.resolve(`${myDir}/../node_modules/@magikcraft/mct1`)

const worldSpec = require('../package.json').mct1Worlds

module.exports = {
    mct1PluginDir,
    mct1PluginSrc,
    mct1WorldDir,
    worldSpec,
}
