import { defineConfig, type Plugin } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { mockPets } from './src/mocks/petsFixture';

const isPetsPath = (url: string | undefined): boolean => {
  if (!url) {
    return false;
  }

  return url.split('?')[0] === '/pets';
};

const sendPetsResponse = (res: { statusCode: number; setHeader: (name: string, value: string) => void; end: (chunk: string) => void }) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(mockPets));
};

const mockPetsApiPlugin = (): Plugin => {
  return {
    name: 'mock-pets-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const incomingRequest = req as { method?: string; url?: string };
        if (incomingRequest.method === 'GET' && isPetsPath(incomingRequest.url)) {
          sendPetsResponse(res);
          return;
        }

        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const incomingRequest = req as { method?: string; url?: string };
        if (incomingRequest.method === 'GET' && isPetsPath(incomingRequest.url)) {
          sendPetsResponse(res);
          return;
        }

        next();
      });
    },
  };
};

export default defineConfig({
  plugins: [react(), mockPetsApiPlugin()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    clearMocks: true,
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['tests/e2e/**'],
  },
});
