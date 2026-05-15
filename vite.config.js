import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createHtmlPlugin } from 'vite-plugin-html';
import { siteData } from './src/data/data.js' // Import your data


export default defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          siteName: siteData.siteName,
          siteTitle: siteData.siteTitle,
          siteDescription: siteData.siteDescription,
          keywords: siteData.seo.keywords,
        },
      },
    }),
  ],
})