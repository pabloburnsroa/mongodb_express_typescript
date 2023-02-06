import mongoose from 'mongoose';
import log from '../utils/logger';

async function connect() {
  const dbUri = process.env.DB_URI as string;

  try {
    await mongoose.connect(dbUri);
    log.info('[database]: Connected to MongoDB');
  } catch (error) {
    log.error('Could not connect to MongoDB');
    process.exit(1);
  }
}

export default connect;
