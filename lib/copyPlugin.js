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
    return fs
        .copy(srcPath, targetPath, { overwrite: true })
        .then(() => console.log(`Installed plugin to ${targetPath}`))
        .catch(e => {
            console.log(e)
            console.log(`Plugin installation failed!`)
            console.log(
                'Please report this full log at https://github.com/Magikcraft/mct1-server/issues'
            )
        })
}
