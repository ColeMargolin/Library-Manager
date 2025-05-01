const express = require('express');
const Author = require('../models/Author');
const router = express.Router();

// GET /api/authors/ - Fetch all authors from the database.
router.get('/', async (req, res) => {
  try {
      const authors = await req.app.locals.db.collection('authors').find({}).toArray();
      res.json(authors);
  } catch (error) {
      res.status(500).json({ message: "Error fetching authors" });
  }
});


// POST a new author (adds an author directly to the database)
router.post('/', async (req, res) => {
    try {
      const { name, birthYear } = req.body;
      const existingAuthor = await Author.findOne({ name });
      if (existingAuthor) return res.status(400).json({ message: "Author already exists" });
      const newAuthor = new Author({ name, birthYear });
      await newAuthor.save();
      res.status(201).json(newAuthor);
    } catch (err) {
      res.status(500).json({ message: "Error adding author", error: err });
    }
});

module.exports = router;