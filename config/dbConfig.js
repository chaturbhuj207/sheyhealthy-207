const mongoose = require('mongoose')
require('dotenv').config();
const connect = mongoose.connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 10000,
})
    .then(() => { console.log('MongoDB connected successfully!'); })
    .catch((err) => { console.error('MongoDB connection error:', err); });


module.exports = connect;