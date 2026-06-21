import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import svgr from 'vite-plugin-svgr'
export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/investiq/" : "/",
  plugins: [
    svgr(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
}));
 
