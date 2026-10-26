import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import { pathToFileURL } from 'url';

// En Vercel, /guia y /ebook funcionan gracias a "cleanUrls" (vercel.json)
// y /api/* son funciones del servidor. Este plugin replica ambas cosas en local.
const PAGINAS = { '/guia': '/guia.html', '/ebook': '/ebook.html', '/quienes-somos': '/quienes-somos.html' };
const API = {
  '/api/ebook/acceso': 'api/ebook/acceso.js',
  '/api/ebook/descargar': 'api/ebook/descargar.js',
};

function vercelLocal() {
  const middleware = async (req, res, next) => {
    const url = new URL(req.url, 'http://localhost');
    if (PAGINAS[url.pathname]) {
      req.url = PAGINAS[url.pathname] + url.search;
      return next();
    }
    const archivo = API[url.pathname];
    if (!archivo) return next();
    try {
      req.query = Object.fromEntries(url.searchParams);
      const modulo = await import(`${pathToFileURL(resolve(__dirname, archivo)).href}?t=${Date.now()}`);
      await modulo.default(req, res);
    } catch (error) {
      next(error);
    }
  };
  return {
    name: 'vercel-local',
    configureServer(server) { server.middlewares.use(middleware); },
    configurePreviewServer(server) { server.middlewares.use(middleware); },
  };
}

export default defineConfig(({ mode }) => {
  // Hace visibles EBOOK_PASSWORD / EBOOK_SECRET de .env.local para las funciones en local.
  const env = loadEnv(mode, process.cwd(), 'EBOOK_');
  Object.assign(process.env, env);

  return {
    plugins: [vercelLocal()],
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          quienesSomos: resolve(__dirname, 'quienes-somos.html'),
          guia: resolve(__dirname, 'guia.html'),
          ebook: resolve(__dirname, 'ebook.html'),
        },
      },
    },
  };
});
