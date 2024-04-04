import mongoose from 'mongoose';

const connection = {};

export async function MongooseClient() {
  try {
    if (connection.connected) return;
    const db = await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017');
    connection.connected = db.connections[0].readyState;
  } catch (err) {
    throw err;
  }
}
