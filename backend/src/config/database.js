const mongoose = require('mongoose');
//uri = "mongodb://localhost:27017/elearning"
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI );

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Handle initial connection errors
        mongoose.connection.on('error', (err) => {
            console.error(`MongoDB connection error: ${err}`);
        });

        // Handle disconnection
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB; 