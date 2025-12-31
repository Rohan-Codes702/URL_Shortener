import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import urlRoutes from "./routes/url.js"
dotenv.config();
const app = express();
// CORS: allow configured frontend origin in production, default to allow all in development
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/",urlRoutes)



// connect to DB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error('Missing MONGO_URL in environment. Set MONGO_URL and restart.');
  process.exit(1);
}

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');

    // Serve frontend build (if present) - useful when deploying a combined app
    import('path').then((path) => {
      import('fs').then((fs) => {
        import('url').then(({fileURLToPath}) => {
          const __filename = fileURLToPath(import.meta.url);
          const __dirname = path.dirname(__filename);
          const staticPath = path.join(__dirname, '..', 'frontend', 'dist');

          if (fs.existsSync(staticPath)) {
            app.use(express.static(staticPath));
            app.get('*', (req, res) => {
              res.sendFile(path.join(staticPath, 'index.html'));
            });
          }
        });
      });
    });

      app.get('/health', (_req, res) => res.json({status: 'ok'}));

      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
