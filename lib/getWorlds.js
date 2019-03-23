/**
 * This file contains code shamelessly, and grateful, cribbed from Medium Phantomjs installer. It is licensed under Apache 2.0.
 */
const path = require('path')
const request = require('request')
const os = require('os')
const url = require('url')
const requestProgress = require('request-progress')
const progress = require('progress')
const extractZip = require('extract-zip')
const rmrf = require('rimraf')
const util = require('util')
const fs = require('fs-extra')

module.exports = {
    getWorlds,
    mct1WorldsExistLocally,
}

const { downloadUrl, mct1WorldDir: targetPath } = require('./util')

function getWorlds() {
    return Promise.resolve()
        .then(downloadMCT1Worlds)
        .then(extractDownload)
        .then(copyIntoPlace)
}

function mct1WorldsExistLocally() {
    return fs.existsSync(targetPath)
}

function downloadMCT1Worlds() {
    return new Promise(resolve => {
        const tmpPath = findSuitableTempDirectory()
        const fileName = downloadUrl.split('/').pop()
        const downloadedFile = path.join(tmpPath, fileName)

        if (fs.existsSync(downloadedFile)) {
            console.log('Worlds already downloaded as', downloadedFile)
            return resolve(downloadedFile)
        }

        // Start the install.
        console.log('Downloading MCT1 worlds')
        console.log('Downloading', downloadUrl)
        console.log('Saving to', downloadedFile)
        resolve(requestWorldZip(getRequestOptions(), downloadedFile))
    })
}

function getRequestOptions() {
    const strictSSL = !!process.env.npm_config_strict_ssl
    if (process.version == 'v0.10.34') {
        console.log(
            'Node v0.10.34 detected, turning off strict ssl due to https://github.com/joyent/node/issues/8894'
        )
        strictSSL = false
    }

    const options = {
        uri: downloadUrl,
        encoding: null, // Get response as a buffer
        followRedirect: true, // The default download path redirects to a CDN URL.
        headers: {},
        strictSSL: strictSSL,
    }

    const proxyUrl =
        process.env.npm_config_https_proxy ||
        process.env.npm_config_http_proxy ||
        process.env.npm_config_proxy
    if (proxyUrl) {
        // Print using proxy
        var proxy = url.parse(proxyUrl)
        if (proxy.auth) {
            // Mask password
            proxy.auth = proxy.auth.replace(/:.*$/, ':******')
        }
        console.log('Using proxy ' + url.format(proxy))

        // Enable proxy
        options.proxy = proxyUrl
    }

    // Use the user-agent string from the npm config
    options.headers['User-Agent'] = process.env.npm_config_user_agent

    // Use certificate authority settings from npm
    var ca = process.env.npm_config_ca
    if (!ca && process.env.npm_config_cafile) {
        try {
            ca = fs
                .readFileSync(process.env.npm_config_cafile, {
                    encoding: 'utf8',
                })
                .split(/\n(?=-----BEGIN CERTIFICATE-----)/g)

            // Comments at the beginning of the file result in the first
            // item not containing a certificate - in this case the
            // download will fail
            if (ca.length > 0 && !/-----BEGIN CERTIFICATE-----/.test(ca[0])) {
                ca.shift()
            }
        } catch (e) {
            console.error(
                'Could not read cafile',
                process.env.npm_config_cafile,
                e
            )
        }
    }

    if (ca) {
        console.log('Using npmconf ca')
        options.agentOptions = {
            ca: ca,
        }
        options.ca = ca
    }

    return options
}

function extractDownload(filePath) {
    return new Promise((resolve, reject) => {
        // extract to a unique directory in case multiple processes are
        // installing and extracting at once
        const extractedPath = filePath + '-extract-' + Date.now()
        var options = { cwd: extractedPath }

        fs.mkdirsSync(extractedPath, '0777')
        // Make double sure we have 0777 permissions; some operating systems
        // default umask does not allow write by default.
        fs.chmodSync(extractedPath, '0777')

        if (filePath.substr(-4) === '.zip') {
            console.log('Extracting zip contents')
            extractZip(path.resolve(filePath), { dir: extractedPath }, function(
                err
            ) {
                if (err) {
                    console.error('Error extracting zip')
                    reject(err)
                } else {
                    resolve(extractedPath)
                }
            })
        }
    })
}

function copyIntoPlace(extractedPath) {
    const rm = util.promisify(rmrf)
    console.log('Removing', targetPath)

    return rm(targetPath)
        .then(() => {
            const move = util.promisify(fs.move)
            // Look for the extracted directory, so we can rename it.
            return move(extractedPath, targetPath, {
                overwrite: true,
            }).catch(error => {
                console.log(
                    'Error copying ' + extractedPath + ' to ' + targetPath
                )
                console.log(error)
                exit(1)
            })
        })
        .then(() => {
            console.log('Copied MCT1 worlds to ' + targetPath)
        })

    // console.log('Could not find extracted file', files)
    // throw new Error('Could not find extracted file')
}

function requestWorldZip(requestOptions, filePath) {
    return new Promise(resolve => {
        const writePath = filePath + '-download-' + Date.now()

        console.log('Receiving...')
        var bar = null
        requestProgress(
            request(requestOptions, function(error, response, body) {
                console.log('')
                if (!error && response.statusCode === 200) {
                    fs.writeFileSync(writePath, body)
                    console.log(
                        'Received ' +
                            Math.floor(body.length / 1024) +
                            'K total.'
                    )
                    fs.renameSync(writePath, filePath)
                    resolve(filePath)
                } else if (response) {
                    console.error(
                        'Error requesting archive.\n' +
                            'Status: ' +
                            response.statusCode +
                            '\n' +
                            'Request options: ' +
                            JSON.stringify(requestOptions, null, 2) +
                            '\n' +
                            'Response headers: ' +
                            JSON.stringify(response.headers, null, 2) +
                            '\n' +
                            'Make sure your network and proxy settings are correct.\n\n' +
                            'If you continue to have issues, please report this full log at ' +
                            'https://github.com/Magikcraft/mct1-server/issues'
                    )
                    exit(1)
                } else {
                    handleRequestError(error)
                }
            })
        )
            .on('progress', function(state) {
                try {
                    if (!bar) {
                        bar = new progress('  [:bar] :percent', {
                            total: state.size.total,
                            width: 40,
                        })
                    }
                    bar.curr = state.size.transferred
                    bar.tick()
                } catch (e) {
                    // It doesn't really matter if the progress bar doesn't update.
                }
            })
            .on('error', handleRequestError)
    })
}

function handleRequestError(error) {
    if (
        error &&
        error.stack &&
        error.stack.indexOf('SELF_SIGNED_CERT_IN_CHAIN') != -1
    ) {
        console.error(
            'Error making request, SELF_SIGNED_CERT_IN_CHAIN. ' +
                'Please read https://github.com/Medium/phantomjs#i-am-behind-a-corporate-proxy-that-uses-self-signed-ssl-certificates-to-intercept-encrypted-traffic'
        )
        exit(1)
    } else if (error) {
        console.error(
            'Error making request.\n' +
                error.stack +
                '\n\n' +
                'Please report this full log at https://github.com/Magikcraft/mct1-server/issues'
        )
        exit(1)
    } else {
        console.error(
            'Something unexpected happened, please report this full ' +
                'log at https://github.com/Magikcraft/mct1-server/issues'
        )
        exit(1)
    }
}

function findSuitableTempDirectory() {
    var now = Date.now()
    var candidateTmpDirs = [
        process.env.npm_config_tmp,
        os.tmpdir(),
        path.join(process.cwd(), 'tmp'),
    ]

    for (var i = 0; i < candidateTmpDirs.length; i++) {
        var candidatePath = candidateTmpDirs[i]
        if (!candidatePath) continue

        try {
            candidatePath = path.join(path.resolve(candidatePath), 'mct1')
            fs.mkdirsSync(candidatePath, '0777')
            // Make double sure we have 0777 permissions; some operating systems
            // default umask does not allow write by default.
            fs.chmodSync(candidatePath, '0777')
            var testFile = path.join(candidatePath, now + '.tmp')
            fs.writeFileSync(testFile, 'test')
            fs.unlinkSync(testFile)
            return candidatePath
        } catch (e) {
            console.log(candidatePath, 'is not writable:', e.message)
        }
    }

    console.error(
        'Can not find a writable tmp directory, please report issue ' +
            'on https://github.com/Magikcraft/mct1-server/issues with as much ' +
            'information as possible.'
    )
    exit(1)
}
