import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

// https://vitejs.dev/config/
export default ({mode}) => {
  process.env = {
    ...process.env,
    ...loadEnv(mode, process.cwd()),
  }
  
  return defineConfig({
    plugins: [react(), TanStackRouterVite(), vanillaExtractPlugin()],
    server: {
      host: true,
      port: 5173,
    },
    base: process.env.VITE_BASE_URL
  });
} 