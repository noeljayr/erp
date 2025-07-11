require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(
  cors({
    origin: '*', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'], // Specify allowed headers
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const mongoURI =
  process.env.MONGO_URI ||
  'mongodb://bintel:674H91iIspXYn7PZ@ac-jozvsar-shard-00-00.wtho7iy.mongodb.net:27017,ac-jozvsar-shard-00-01.wtho7iy.mongodb.net:27017,ac-jozvsar-shard-00-02.wtho7iy.mongodb.net:27017/requests?ssl=true&replicaSet=atlas-knvm84-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// ==== ROUTES ====
app.get('/', (req, res) => {
  res.send('Requests API is running');
});

const requestRoutes = require('./routes/requestRoutes');
app.use('/api/requests', requestRoutes);

const userRoutes = require('./routes/usersRoutes');
app.use('/api/users', userRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5100;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
