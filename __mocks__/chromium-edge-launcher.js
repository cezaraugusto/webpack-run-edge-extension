/* global jest */
const EdgeLauncher = jest.genMockFromModule('chromium-edge-launcher')

async function launchEdge (opts = {}) {
  const fsMock = {
    openSync: () => {},
    closeSync: () => {},
    writeFileSync: () => {}
  }

  const spawnStub = jest.fn().mockReturnValue({ pid: 'pid' })

  const moduleOverrides = { fs: fsMock, rimraf: jest.fn(), spawn: spawnStub }
  const edgeInstance = new EdgeLauncher.Launcher(opts, moduleOverrides)

  jest
    .spyOn(edgeInstance, 'waitUntilReady')
    .mockReturnValue(Promise.resolve({}))

  edgeInstance.prepare()

  try {
    await edgeInstance.launch()

    return Promise.resolve(spawnStub)
  } catch (err) {
    return Promise.reject(err)
  }
}

EdgeLauncher.Launcher.defaultFlags = jest.fn().mockReturnValue([
  '--disable-features=TranslateUI',
  '--disable-extensions',
  '--disable-component-extensions-with-background-pages',
  '--disable-background-networking',
  '--disable-sync',
  '--metrics-recording-only',
  '--disable-default-apps',
  '--mute-audio',
  '--no-default-browser-check',
  '--no-first-run',
  '--disable-backgrounding-occluded-windows',
  '--disable-renderer-backgrounding',
  '--disable-background-timer-throttling',
  '--force-fieldtrials=*BackgroundTracing/default/'
])
EdgeLauncher.killAll = jest.fn()
EdgeLauncher.launch = (opts) => launchEdge(opts)

module.exports = EdgeLauncher
