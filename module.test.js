/* global jest, describe, beforeEach, afterEach, it, expect */
const EdgeLauncher = require('chromium-edge-launcher')

const serveExtension = require('./steps/serveExtension')

// RunEdgeExtension is now a mock constructor
jest.mock('./module')
jest.mock('./steps/manifest-entries/watch/createUserDataDir')

describe('webpack-run-edge-extension', () => {
  describe('webpack config', () => {
    describe('serveExtension', () => {
      let spy

      beforeEach(() => {
        spy = jest.spyOn(EdgeLauncher, 'launch')
      })
      afterEach(() => {
        spy.mockRestore()
      })

      it('`extensionPath` config sets respective browser flag', async () => {
        await serveExtension({
          autoReload: false,
          extensionPath: 'my/extension/path'
        })

        const { edgeFlags } = await EdgeLauncher.launch.mock.calls[0][0]
        const flag = edgeFlags.find(flag => flag.startsWith('--load-extension'))

        expect(flag.endsWith('my/extension/path')).toBe(true)
      })

      it(
        '`browserFlags` config sets respective user-specified browser flags',
        async () => {
          await serveExtension({
            browserFlags: ['--some-flag=flagvalue', '--another-flag=value2']
          })

          const { edgeFlags } = await EdgeLauncher.launch.mock.calls[0][0]
          const flag1 = edgeFlags.find(flag => flag.startsWith('--some-flag'))
          const flag2 = edgeFlags.find(flag => flag.startsWith('--another-flag'))

          expect(flag1.endsWith('value')).toBe(true)
          expect(flag2.endsWith('value2')).toBe(true)
        }
      )

      it('`userDataDir` config sets respective browser flag', async () => {
        await serveExtension({ userDataDir: 'my/profile/dir' })

        const { userDataDir } = await EdgeLauncher.launch.mock.calls[0][0]

        expect(userDataDir).toBe('my/profile/dir')
      })

      it('`startingUrl` config sets respective browser flag', async () => {
        await serveExtension({ startingUrl: 'my/starting/url' })

        const { startingUrl } = await EdgeLauncher.launch.mock.calls[0][0]

        expect(startingUrl).toBe('my/starting/url')
      })

      it('`autoReload` config loads reload extesion by default', async () => {
        await serveExtension()

        const { edgeFlags } = await EdgeLauncher.launch.mock.calls[0][0]
        const flag1 = edgeFlags.find(flag => flag.startsWith('--load-extension'))

        expect(flag1.endsWith('extension,')).toBe(true)
      })

      it(
        '`autoReload` config does not load reload extesion by default',
        async () => {
          await serveExtension({ autoReload: false })

          const { edgeFlags } = await EdgeLauncher.launch.mock.calls[0][0]
          const flag1 = edgeFlags.find(flag => flag.startsWith('--load-extension'))

          expect(flag1.endsWith('extension')).not.toBe(true)
        }
      )

      it(
        '`autoReload` config loads both user extension and reloader as expected',
        async () => {
          await serveExtension({ extensionPath: 'my/extension/path' })

          const { edgeFlags } = await EdgeLauncher.launch.mock.calls[0][0]
          const flags = edgeFlags.find(flag => flag.startsWith('--load-extension'))
          const [flag1, flag2] = flags.split(',')

          expect(flag1.endsWith('extension')).toBe(true)
          expect(flag2.endsWith('my/extension/path')).toBe(true)
        }
      )
    })
  })
})
