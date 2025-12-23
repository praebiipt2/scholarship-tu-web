import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), flowbiteReact()],
  server:{
    host: true,
    port: 5173,
    watch:{
      usePolling: true
    }
  },
 /*  proxy:{
    '/api': {
      target: 'http//backend:5000',
      changeOrigin:true,
      secure:false
    }
  } */
})