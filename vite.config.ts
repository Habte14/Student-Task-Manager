import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tamaguiPlugin } from '@tamagui/vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    // Required for Tamagui to fully resolve responsive breakpoints
    // ($gtXs, $gtSm, ...) and token shorthands (e.g. borderRadius: '$6')
    // into real CSS. Without this plugin Tamagui falls back to a
    // reduced runtime mode where those don't always apply.
    tamaguiPlugin({
      config: './src/tamagui.config.ts',
      components: ['tamagui'],
    }),
  ],
  define: {
    DEV: `${process.env.NODE_ENV === 'development'}`,
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'development'),
  },
  resolve: {
    // tamagui's web components import from 'react-native-web'; this also
    // covers any package that imports the plain 'react-native' name.
    alias: {
      'react-native': 'react-native-web',
    },
    // If npm installs more than one copy of these packages (common when
    // @tamagui/vite-plugin pulls in its own nested copy of tamagui/core),
    // each copy creates its own global config registry. The compiled
    // styles then get extracted against one registry while the React
    // tree renders against the other, and Tamagui silently falls back to
    // a bare default config (no media breakpoints, no radius tokens) for
    // whichever side lost — this is the "global config fallback" warning.
    // Deduping forces a single shared instance.
    dedupe: ['react', 'react-dom', 'tamagui', '@tamagui/core', '@tamagui/web', '@tamagui/config'],
  },
  optimizeDeps: {
    esbuildOptions: {
      resolveExtensions: [
        '.web.js',
        '.web.jsx',
        '.web.ts',
        '.web.tsx',
        '.mjs',
        '.js',
        '.mts',
        '.ts',
        '.jsx',
        '.tsx',
        '.json',
      ],
      // some react-native-web packages ship JSX in plain .js files
      loader: {
        '.js': 'jsx',
      },
    },
  },
  server: {
    open: true,
    proxy: {
      '/rpc': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
