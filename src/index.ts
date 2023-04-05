import type { Plugin, ViteDevServer } from 'vite'
import { resolve } from 'node:path'
import { writeFile, unlink } from 'node:fs/promises'
import { liveReload } from 'vite-plugin-live-reload'

export interface Config {
  /**
   * Wether templates, snippets, controllers, models and content changes should
   * be watched and cause a reload. Either enable/disable it or provide your own
   * paths to watch.
   * @see https://github.com/arnoson/vite-plugin-live-reload
   * @default true
   */
  watch?: boolean | string[],

  /**
   * The directory the `.dev` file is placed.
   * @default process.cwd()
   */
  devDir?: string
}

export default ({ watch = true, devDir = process.cwd() } = {} as Config): Plugin => {
  const devPath = resolve(devDir, '.dev')

  return {
    name: 'vite-plugin-kirby',

    config() {
      return { build: { manifest: true } }
    },

    configureServer(server: ViteDevServer) {
      const { config } = server

      server.httpServer?.once('listening', () => {
        if (!config.server.origin) {
          const { https, port, host = 'localhost' } = config.server
          const protocol = https ? 'https' : 'http'
          config.server.origin = `${protocol}://${host}:${port}`
        }

        writeFile(devPath, `VITE_SERVER=${config.server.origin}`)
      })

      if (watch) {
        const defaultPaths = [
          '../site/(templates|snippets|controllers|models|layouts)/**/*.php',
          '../content/**/*',
        ]
        const paths = watch === true ? defaultPaths : watch
        // @ts-ignore
        liveReload(paths).configureServer(server)
      }
    },

    buildStart() {
      unlink(devPath).catch((_e: Error) => {})
    },
  }
}
