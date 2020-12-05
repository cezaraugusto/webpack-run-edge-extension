const ChromeLauncher = require('chrome-launcher')
const browserConfig = require('../browser.config')

process.on('SIGINT', async () => {
  await ChromeLauncher.killAll()
})
process.on('SIGTERM', async () => {
  await ChromeLauncher.killAll()
})

process.on('unhandledRejection', (error) => { throw error })

module.exports = async function (self) {
  const defaultFlags = ChromeLauncher
    .Launcher.defaultFlags()
    .filter(flag => flag !== '--disable-extensions')

  // Get user defaults so we can set the browser flags
  const browserConfigOptions = {
    defaultFlags: defaultFlags || [],
    browserFlags: self.browserFlags || [],
    userDataDir: self.userDataDir,
    startingUrl: self.startingUrl,
    autoReload: self.autoReload || true
  }

  // Set user defaults to browser
  const chromeConfig = browserConfig(self.extensionPath, browserConfigOptions)
  return await ChromeLauncher.launch(chromeConfig)
}
