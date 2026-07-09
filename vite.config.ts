import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// En GitHub Pages la base es /nombre-del-repo/
const repoName = process.env.REPO_NAME || ''
const isGitHubPages = process.env.GITHUB_PAGES === 'true'

export default defineConfig({
  base: isGitHubPages && repoName ? `/${repoName}/` : '/',
  plugins: [react(), tailwindcss()],
})
