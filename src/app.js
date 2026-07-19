const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const trackAnalytics = require('./middleware/analyticsMiddleware');

const parseAllowedOrigins = (envValue) => {
  if (!envValue) return '*';
  const origins = envValue.split(',').map((origin) => origin.trim()).filter(Boolean);
  if (origins.length === 1) return origins[0];
  return origins;
};

const allowedOrigins = parseAllowedOrigins(process.env.CLIENT_URL);

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const courseRoutes = require('./routes/courseRoutes');
const courseCoachRoutes = require('./routes/courseCoachRoutes');
const contactRoutes = require('./routes/contactRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Journalise chaque requête API pour les statistiques du dashboard
app.use(trackAnalytics);

// Route de santé (utile pour vérifier que le déploiement fonctionne)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API FitClub opérationnelle' });
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/courses', courseCoachRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
