require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB before starting listener
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 ToDo API Server running on port ${PORT}`);
    console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Client URL  : ${process.env.CLIENT_URL || 'http://localhost:5173'}\n`);
  });
});
