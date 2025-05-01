// Initializes everything on the backend (MongoDB/Express) & ensures requests are processed correctly
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Imports route modules for books, authors, & genres
const bookRoutes = require('./routes/bookRoutes');
const authorRoutes = require('./routes/authorRoutes');
const genreRoutes = require('./routes/genreRoutes');
const app = express();
app.use(cors());
app.use(express.json()); // Allows JSON parsing for incoming requests

mongoose.connect('mongodb://localhost:27017/myDatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async (conn) => {
  console.log('MongoDB Connected');
  app.locals.db = conn.connection.db; // Give access to native MongoDB for routes
}).catch(err => console.log(err));

// Use express's API routes at specified paths
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/genres', genreRoutes);

// Starts the express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});