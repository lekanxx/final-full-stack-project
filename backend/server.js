const express = require('express');
const mongoose = require('mongoose');

// Load .env variables
require('dotenv').config();

const app = express();

// Allow JSON data
app.use(express.json());

// Connect to MongoDB
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);

        console.log('Connected to MongoDB');

        app.listen(3000, () => {
            console.log('App is listening on port 3000');
        });

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

// Start the application
connect();