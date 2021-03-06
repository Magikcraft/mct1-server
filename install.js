/**
 * This file contains code shamelessly, and grateful, cribbed from Medium Phantomjs installer. It is licensed under Apache 2.0.
 */
const exec = require('child_process').exec
const chalk = require('chalk')

const {
    getWorlds,
    mct1WorldsExistLocally,
    worldUpdateAvailable,
    getLocalWorldsMetadata,
} = require('./lib/getWorlds')
const { copyPlugin } = require('./lib/copyPlugin')
const { mct1WorldDir } = require('./lib/util')

// If the process exits without going through exit(), then we did not complete.
var validExit = false

Promise.resolve(true)
    .then(checkForDocker)
    .then(copyPlugin)
    .then(checkMCT1WorldsLocally)
    .then(getWorlds)
    .then(() => exit(0))
    .catch(e => {
        console.log(`An error occured during installation`)
        console.log(e)
        exit(1)
    })

function checkForDocker() {
    return new Promise(resolve => {
        exec('docker', {}, function(error, stdout, stderr) {
            if (error) {
                console.log(
                    'Docker not found. Please install Docker from https://www.docker.com.'
                )
                exit(1)
            } else {
                resolve(true)
            }
        })
    })
}

function checkMCT1WorldsLocally() {
    if (mct1WorldsExistLocally()) {
        return Promise.resolve()
            .then(getLocalWorldsMetadata)
            .then(({ version }) => {
                return console.log(
                    `Found MCT1 worlds version ${version} installed at`,
                    mct1WorldDir
                )
            })
            .then(worldUpdateAvailable)
            .then(updateAvailable => {
                if (updateAvailable) {
                    console.log(
                        chalk.yellow(
                            `World update available: ${updateAvailable}`
                        )
                    )
                }
                return updateAvailable || exit(0)
            })
    } else {
        return Promise.resolve()
    }
}

process.on('exit', function() {
    if (!validExit) {
        console.log('Install exited unexpectedly')
        exit(1)
    }
})

function exit(code) {
    validExit = true
    if (code === 0) {
        console.log(`MCT1 Server installed.`)
        console.log(
            '\n' +
                chalk.blue('Type ') +
                chalk.yellow('mct1-server start') +
                chalk.blue(' to start\n')
        )
    }
    process.exit(code || 0)
}
