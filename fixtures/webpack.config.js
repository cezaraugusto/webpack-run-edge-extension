const path = require('path')

const OpenChromeExtension = require('../module')

module.exports = {
  mode: 'development',
  entry: {
    background: path.resolve(__dirname, './demo-extension/background/background.js')
  },
  plugins: [
    new OpenChromeExtension({
      extensionPath: path.resolve(__dirname, './demo-extension')
    })
  ]
}
