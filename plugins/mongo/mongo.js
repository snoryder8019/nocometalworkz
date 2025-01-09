import { MongoClient } from 'mongodb';
import  config from '../../routes/config.js';

let _db;

export const connect = async () => {
  if (!_db) {
    const client = new MongoClient(config.DB_URL);
    await client.connect();
    _db = client.db(config.DB_NAME);
    console.log('Connected to MongoDB');
  }
  return _db;
};

export const getDb = () => {
  if (!_db) {
    throw new Error('Database not initialized');
  }
  return _db;
};