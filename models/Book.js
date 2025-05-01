const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    // Connects Author & Genre documents w/ MongoDB ObjectIds
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
    genre: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre', required: true },
    publicationYear: { type: Number, required: true, index: true },
    copiesAvailable: { type: Number, required: true, min: 0 },
});

// Compound Index for multi-parameter queries (like the Report Page)
// Specifies the order of priority for indexing left to right
BookSchema.index({ author: 1, genre: 1, publicationYear: 1 });

// Creates mongoose model (ODM)
module.exports = mongoose.model('Book', BookSchema);