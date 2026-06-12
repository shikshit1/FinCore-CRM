import mongoose from 'mongoose';
import User from '../models/User.js';

/** Remove legacy indexes left from older schemas (e.g. username_1 blocking registration). */
const cleanupStaleIndexes = async () => {
  try {
    const users = mongoose.connection.collection('users');
    const indexes = await users.indexes();
    const hasStaleUsername = indexes.some((idx) => idx.name === 'username_1');
    if (hasStaleUsername) {
      await users.dropIndex('username_1');
      console.log('Dropped stale users.username_1 index');
    }
    await User.syncIndexes();

    const Customer = (await import('../models/Customer.js')).default;
    const migrated = await Customer.updateMany(
      { status: { $nin: ['active', 'inactive'] } },
      { $set: { status: 'active' } }
    );
    if (migrated.modifiedCount > 0) {
      console.log(`Normalized ${migrated.modifiedCount} customer status record(s) to active`);
    }
  } catch (error) {
    if (error.code !== 27) {
      console.warn('Index cleanup warning:', error.message);
    }
  }
};

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || '');
    console.log(`MongoDB connected: ${conn.connection.host}`);
    await cleanupStaleIndexes();
    return conn;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
