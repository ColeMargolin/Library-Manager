const mongoose = require('mongoose');

const GenreSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, index: true},
});

// Creates mongoose model (ODM)
module.exports = mongoose.model('Genre', GenreSchema);