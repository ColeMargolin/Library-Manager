const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, index: true },
  birthYear: { type: Number },
});

// Creates mongoose model (ODM)
module.exports = mongoose.model('Author', AuthorSchema);