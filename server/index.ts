import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config';
import apiRoutes from './routes/api';
import { apiLimiter, errorHandler } from './middleware/security';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "http://localhost:*", "https://*.googleapis.com", "https://*.firebaseio.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Cross-origin resource sharing
app.use(cors({
  origin: true,
  credentials: true
}));

// Body parsing with limits to prevent payload abuse
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Apply rate limiter to /api
app.use('/api', apiLimiter);

// Mount API routes
app.use('/api', apiRoutes);

// Serve static frontend build files if in production
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback to index.html for client-side routing in SPA mode
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      // In dev mode when dist is not built yet
      res.status(200).send('Census AI Enumerator API Server is running. Access frontend on Vite dev server (port 5173).');
    }
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`====================================================`);
  console.log(`  🏛️ CENSUS AI ENUMERATOR — CIVIC TECH BACKEND API`);
  console.log(`  Server running on http://localhost:${config.port}`);
  console.log(`  Environment: ${config.nodeEnv}`);
  console.log(`  Gemini AI Status: ${config.geminiApiKey ? 'Configured & Active' : 'Fallback to Grounded KB (Active)'}`);
  console.log(`====================================================`);
});

export default app;
