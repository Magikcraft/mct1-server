const fs = require('fs-extra')

const {
    mct1PluginDir: targetPath,
    mct1PluginSrc: srcPath,
    mct1PluginDir,
} = require('./util')

module.exports = {
    copyPlugin,
    pluginExists,
    pluginVersion,
}
function pluginExists() {
    return fs.existsSync(targetPath)
}

function pluginVersion() {
    return pluginExists()
        ? require(`${mct1PluginDir}/package`).version
        : 'Not found'
}

function copyPlugin() {
    return fs
        .copy(srcPath, targetPath, { overwrite: true })
        .then(() =>
            console.log(
                `Installed plugin version ${pluginVersion()} to ${targetPath}`
            )
        )
        .catch(e => {
            console.log(e)
            console.log(`Plugin installation failed!`)
            console.log(
                'Please report this full log at https://github.com/Magikcraft/mct1-server/issues'
            )
        })
}
