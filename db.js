const mongoose = require('mongoose');

const connectDB = async () => {
  // console.log('@@@@', process.env.MONGODB_URI);
  let dbUrl = "mongodb+srv://hajjrahh:OKIKyKtwzMFv6GmC@hajjrahhdev.fn7t3.mongodb.net/hajjrahh_database";
  try {
    mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const db = mongoose.connection;

    db.on('connected', () => {
      console.log('MongoDB connected successfully');
    });

    db.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    db.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
  } catch (err) {
    console.error('MongoDB connection catch:', err);
    process.exit(1); // Exit the process with failure
  }
}

module.exports = connectDB;
