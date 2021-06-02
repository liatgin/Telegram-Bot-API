import Mongoose from "mongoose";
import { User } from '../models/user';
import dotenv from 'dotenv';
dotenv.config()
const MONGO_URL = process.env.MONGO_URL

let database: Mongoose.Connection;

export const dbConnect = () => {
  if (database) {
    return;
  }

  Mongoose.connect(<string>MONGO_URL, {
    useCreateIndex: true, 
    useNewUrlParser: true, 
    useUnifiedTopology: true
  });

  database = Mongoose.connection;

  database.once('open', async () => {
    console.log('Connected to database');
  });

  database.on('error', () => {
    console.log('Error connecting to database');
  });

  return {
    User,
  };
};

export const dbDisconnect = () => {
  if (!database) {
    return;
  }

  Mongoose.disconnect();
};