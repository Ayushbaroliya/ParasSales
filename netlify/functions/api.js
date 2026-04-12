import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const app = express();
app.use(cors());
// Set a large body parser limit for potential uploads, although upload.js uses multer
// Netlify functions might bypass multer stream processing if not carefully handled, but 50mb is a good safety net.
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Utility to wrap Vercel exported function to express handler
const wrapApiRoute = (handler) => {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (err) {
      console.error(`Error executing route:`, err);
      if (!res.headersSent) {
          res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  };
};

app.all('/api/auth', wrapApiRoute(require('../../api/auth.js')));
app.all('/api/categories', wrapApiRoute(require('../../api/categories.js')));
app.all('/api/tiles', wrapApiRoute(require('../../api/tiles.js')));
app.all('/api/upload', wrapApiRoute(require('../../api/upload.js')));

export const handler = serverless(app);
