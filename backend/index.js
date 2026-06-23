const express = require('express');
const cors = require('cors');
const path = require('path');
const { init } = require('./db/database');

const app = express();
const PORT = process.env.PORT || 5050;
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS: allow localhost in dev, production domain in prod
const ALLOWED_ORIGINS = [
  /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
  'https://museu.edm.co.mz',
  'http://museu.edm.co.mz',
];
if (process.env.ALLOWED_ORIGIN) {
  ALLOWED_ORIGINS.push(process.env.ALLOWED_ORIGIN);
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // server-to-server / same-origin
    const ok = ALLOWED_ORIGINS.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    ok ? callback(null, true) : callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files — fallback to logo when file is missing
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'logo.png'));
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/testemunhos', require('./routes/testemunhos'));
app.use('/api/patrimonios', require('./routes/patrimonios'));
app.use('/api/exposicoes', require('./routes/exposicoes'));
app.use('/api/eventos', require('./routes/eventos'));
app.use('/api/artefatos', require('./routes/artefatos'));
app.use('/api/tags', require('./routes/tags'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/metrics', require('./routes/metrics'));
app.use('/api/users', require('./routes/users'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/logs', require('./routes/logs'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/testimonials', require('./routes/testemunhos'));
app.use('/api/search', require('./routes/search'));

// Health check
app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', env: NODE_ENV, timestamp: new Date().toISOString() })
);

// In production: serve the React build and handle SPA routing
if (NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ error: err.message || 'Erro interno do servidor' });
});

// Init DB and start server
init();
app.listen(PORT, '127.0.0.1', () => {
  console.log(`✅ Museu Virtual API — ${NODE_ENV} — porta ${PORT}`);
});
