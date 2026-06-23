import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'admin': [
            './components/admin/DashboardLayout',
            './components/admin/DashboardHome',
            './components/admin/AnalyticsDashboard',
            './components/admin/stories/StoryList',
            './components/admin/stories/StoryForm',
            './components/admin/heritage/HeritageList',
            './components/admin/heritage/HeritageForm',
            './components/admin/exhibitions/ExhibitionList',
            './components/admin/exhibitions/ExhibitionForm',
            './components/admin/artifacts/ArtifactList',
            './components/admin/artifacts/ArtifactForm',
            './components/admin/events/EventList',
            './components/admin/events/EventForm',
            './components/admin/comments/CommentsList',
            './components/admin/users/UserList',
            './components/admin/users/UserForm',
            './components/admin/testemunhos/TestemunhosList',
            './components/admin/testemunhos/TestemunhoForm',
          ],
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:5050',
        changeOrigin: true,
      },
      '/uploads': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:5050',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            if (proxyRes.statusCode === 404) {
              proxyRes.resume();
              res.writeHead(302, { Location: '/logo.png' });
              res.end();
            }
          });
        },
      }
    }
  }
})
