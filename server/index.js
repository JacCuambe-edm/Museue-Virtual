const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { initDatabase } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const articlesRoutes = require('./routes/articles');
const testemunhosRoutes = require('./routes/testemunhos');
const testimonialsRoutes = require('./routes/testimonials');
const patrimoniosRoutes = require('./routes/patrimonios');
const exposicoesRoutes = require('./routes/exposicoes');
const eventosRoutes = require('./routes/eventos');
const artefatosRoutes = require('./routes/artefatos');
const commentsRoutes = require('./routes/comments');
const metricsRoutes = require('./routes/metrics');
const tagsRoutes = require('./routes/tags');
const usersRoutes = require('./routes/users');
const dashboardRoutes = require('./routes/dashboard');
const uploadRoutes = require('./routes/upload');

const app = express();

// Basic request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files (for future uploads)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/testemunhos', testemunhosRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/patrimonios', patrimoniosRoutes);
app.use('/api/exposicoes', exposicoesRoutes);
app.use('/api/eventos', eventosRoutes);
app.use('/api/artefatos', artefatosRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Initialize DB and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
});

// Trigger restart
