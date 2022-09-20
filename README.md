# Vite Plugin Kirby

A plugin for using [Vite](https://github.com/vitejs/vite) with [Kirby](https://github.com/getkirby/kirby).

## How it works

### Development/Production Mode

When Vite runs in development mode, a new file called `.dev` is created, containing Vite's dev server URL.

```
VITE_SERVER=http://localhost:5173
```

[kirby-vite](https://github.com/arnoson/kirby-vite), a php plugin for Kirby, can use this file as an indicator to switch into development mode and load scripts and assets from Vite's dev server. When Vite runs in production mode, the `.dev` file is automatically removed.

### Manifest.json

The generation of a `manifest.json` is enabled automatically.

### Static Assets

In order to get static assets to work with kirby-vite, this plugins sets Vite's [server origin](https://vitejs.dev/config/server-options.html#server-origin).

### Watch Files

[vite-plugin-live-reload](https://github.com/arnoson/vite-plugin-live-reload) is used to watch the following paths:

- `site/(templates|snippets|controllers|models|layouts)/**/*.php`
- `content/**/*`

You can disable this behavior or define your own paths:

```js
// vite.config.js
import kirby from 'vite-plugin-kirby'

export default {
  // ...

  plugins: [kirby({ watch: false })]
  // or
  plugins: [
    // Note: paths are relative to Vite's root folder.
    kirby({ watch: ['../site/templates/**/*.php'] })
  ]
}
```
