const mongoose = require('mongoose');

const uri = process.env.DB_URL + '/' + process.env.DB_NAME;

const opts = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  maxPoolSize: 10,
};

mongoose.connect(uri, opts)
  .then(() => console.log('MongoDB connected — nocometalworkz'))
  .catch(err => console.error('MongoDB connection error:', err));

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected — retrying...');
  setTimeout(() => mongoose.connect(uri, opts).catch(console.error), 3000);
});

mongoose.connection.on('error', err => console.error('MongoDB error:', err));
