const express = require('express');
const Genre = require('../models/Genre');
const router = express.Router();

// GET /api/genres/ - Fetch all genres from the database.
router.get('/', async (req, res) => {
  try {
      // MongoDB Function
      const genres = await req.app.locals.db.collection('genres').find({}).toArray();
      res.json(genres);
  } catch (error) {
      res.status(500).json({ message: "Error fetching genres" });
  }
});


// POST a new genre (adds a genre directly to the database)
router.post('/', async (req, res) => {
    try {
      const { name } = req.body;
      const existingGenre = await Genre.findOne({ name });
      if (existingGenre) return res.status(400).json({ message: "Genre already exists" });
      const newGenre = new Genre({ name });
      await newGenre.save();
      res.status(201).json(newGenre);
    } catch (err) {
      res.status(500).json({ message: "Error adding genre", error: err });
    }
});

module.exports = router;