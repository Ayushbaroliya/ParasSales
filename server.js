import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiDir = path.join(__dirname, 'api');

import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Utility to wrap Vercel exported function to express handler
const wrapApiRoute = (filePath) => {
  return async (req, res) => {
    try {
      // Use createRequire to synchronously load the CommonJS file
      const handler = require(filePath);
      await handler(req, res);
    } catch (err) {
      console.error(`Error executing ${filePath}:`, err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
};

// Start dev server proxy
const start = async () => {
    try {
        const files = fs.readdirSync(apiDir);
        for (const file of files) {
            if (file.endsWith('.js')) {
                const routeName = file.replace('.js', '');
                const filePath = path.join(apiDir, file);
                
                app.all(`/api/${routeName}`, wrapApiRoute(filePath));
                console.log(`[Local API] Loaded route: /api/${routeName}`);
            }
        }
    } catch (e) {
        console.error("Failed to load local API functions from /api", e);
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Local dev proxy running on http://localhost:${PORT}`));
};

start();
