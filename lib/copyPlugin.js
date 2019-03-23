const fs = require('fs-extra')

const { mct1PluginDir: targetPath, mct1PluginSrc: srcPath } = require('./util')

module.exports = {
    copyPlugin,
    pluginExists,
}
function pluginExists() {
    return fs.existsSync(targetPath)
}

function copyPlugin() {
    return fs.copySync(srcPath, targetPath, { overwrite: true })
}
