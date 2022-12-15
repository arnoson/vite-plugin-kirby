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
   */

  watch: boolean | string[]
}

export default ({ watch = true } = {} as Config): Plugin => {
  const devPath = resolve(process.cwd(), '.dev')

  return {
    name: 'vite-plugin-kirby',

    config() {
      return { build: { manifest: true } }
    },

    configureServer(server: ViteDevServer) {
      const { config } = server

      server.httpServer?.once('listening', () => {
        const { https, port, host = 'localhost' } = config.server
        const protocol = https ? 'https' : 'http'

        const url = `${protocol}://${host}:${port}`
        // This is needed to server the assets from the dev server.
        config.server.origin ??= url

        writeFile(devPath, `VITE_SERVER=${url}`)
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
