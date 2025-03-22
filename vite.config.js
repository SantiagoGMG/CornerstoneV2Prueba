import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';

export default defineConfig({
  plugins: [
    react(),
    viteCommonjs(), // Para manejar módulos CommonJS
  ],
  optimizeDeps: {
    exclude: ['@cornerstonejs/dicom-image-loader'], // Excluye el dicom-image-loader de la optimización
  },
});