/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import fs from "fs";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const rootSharedPath = path.resolve(__dirname, '../shared/index.ts');
  const localSharedPath = path.resolve(__dirname, 'src/shared/index.ts');
  const sharedPath = fs.existsSync(rootSharedPath) ? rootSharedPath : localSharedPath;

  return {
    plugins: [react()],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@eldr/shared': sharedPath,
      },
    },

    /**
     * Configuration for proxying auth requests from our domain to firebaseapp.com.
     *
     * @see {@link client/docs/signInWithRedirect.md} for more detailed documentation.
     */
    server: {
      proxy: {
        "/__/auth": {
          target: `https://${process.env.VITE_FIREBASE_AUTHDOMAIN}`,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/__\/auth/, "/__/auth"),
        },
      },
    },

    preview: {
      allowedHosts: ['eldr.up.railway.app'],
    },

    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
    },
  };
});
