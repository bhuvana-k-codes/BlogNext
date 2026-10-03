const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blognest';
    mongoose.set('strictQuery', false);
    
    // Try connecting to standard MongoDB instance
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 2500
      });
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (err) {
      console.log('Local MongoDB daemon not running. Falling back to MongoDB Memory Server...');
      mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      await mongoose.connect(memoryUri);
      console.log(`In-Memory MongoDB Connected at ${memoryUri}`);
    }
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
