const messenger = require('./messenger')

module.exports = function (compiler, wss, extensionPath) {
  return compiler.hooks.watchRun.tapAsync(
    'open-edge-extension',
    (compilation, done) => {
      const files = compilation.modifiedFiles || new Set()
      const changedFile = files.values().next().value

      messenger(wss, extensionPath, changedFile)
      done()
    }
  )
}
