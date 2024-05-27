import mongoose from 'mongoose';

export const config = {
    mongoUri: 'your-mongodb-connection-string-here'
};

export class Database {
  static async connect(): Promise<void> {
    try {
        await mongoose.connect(config.mongoUri);
        console.log('Connected to MongoDB');
      } catch (error) {
        console.error('Error connecting to MongoDB', error);
        process.exit(1);
      }
    }
}