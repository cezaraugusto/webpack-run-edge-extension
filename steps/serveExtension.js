const EdgeLauncher = require('chromium-edge-launcher')

const browserConfig = require('../browser.config')
const createUserDataDir = require('./manifest-entries/watch/createUserDataDir')

process.on('SIGINT', async () => {
  await EdgeLauncher.killAll()
})
process.on('SIGTERM', async () => {
  await EdgeLauncher.killAll()
})

process.on('unhandledRejection', (error) => { throw error })

module.exports = async function (self = {}) {
  const defaultFlags = EdgeLauncher
    .Launcher.defaultFlags()
    .filter(flag => flag !== '--disable-extensions')

  // Get user defaults so we can set the browser flags
  const browserConfigOptions = {
    defaultFlags: defaultFlags || [],
    browserFlags: self.browserFlags || [],
    userDataDir: self.userDataDir || await createUserDataDir(),
    startingUrl: self.startingUrl,
    autoReload: self.autoReload || true
  }

  // Set user defaults to browser
  const edgeConfig = browserConfig(self.extensionPath, browserConfigOptions)

  await EdgeLauncher.launch(edgeConfig)
}
