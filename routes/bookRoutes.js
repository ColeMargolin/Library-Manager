const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Author = require('../models/Author');
const Genre = require('../models/Genre');

// Adds a new book to the database
router.post('/', async (req, res) => {
    console.log("Received POST request:", req.body);
    try {
        const { title, authorName, authorBirthYear, genreName, publicationYear, copiesAvailable } = req.body;

        // Checks if author exists (create if not)
        let author = await Author.findOne({ name: authorName });
        if (!author) {
            author = new Author({ name: authorName, birthYear: authorBirthYear });
            await author.save();
        }

        // Checks if genre exists (create if not)
        let genre = await Genre.findOne({ name: genreName });
        if (!genre) {
            genre = new Genre({ name: genreName });
            await genre.save();
        }

        // Creates the new book
        const newBook = new Book({
            title,
            author: author._id,
            genre: genre._id,
            publicationYear,
            copiesAvailable
        });

        await newBook.save();
        console.log("Book added:", newBook);
        res.status(201).json(newBook);
    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({ message: "Error adding book", error });
    }
});

// Fetches all books from MongoDB & populates author/genre fields
router.get('/', async (req, res) => {
    try {
        const books = await Book.find().populate('author').populate('genre');
        res.json(books); // sends books as a JSON response to client (React component)
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Error fetching books" });
    }
});

// Fetches books based on filters, which is utilized on the Book Report form
router.get('/filter', async (req, res) => {
    try {
      const { authorName, genreName, startYear, endYear } = req.query;
      let query = {};
  
      if (authorName) {
        const author = await Author.findOne({ name: authorName });
        if (!author) return res.json([]);  // Return empty if no author match
        query.author = author._id;
      }
  
      if (genreName) {
        const genre = await Genre.findOne({ name: genreName });
        if (!genre) return res.json([]);  // Return empty if no genre match
        query.genre = genre._id;
      }
  
      if (startYear || endYear) {
        query.publicationYear = {};
        if (startYear) query.publicationYear.$gte = parseInt(startYear);
        if (endYear) query.publicationYear.$lte = parseInt(endYear);
      }
  
      const books = await Book.find(query).populate('author').populate('genre');
      res.json(books);
    } catch (error) {
      console.error("Error fetching filtered books:", error);
      res.status(500).json({ message: "Error fetching books", error });
    }
  });

// Delete a book by its ID
router.delete('/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id); // Finds Book in database by ID & deletes it
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.json({ message: `Book "${book.title}" deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: "Error deleting book", error });
    }
});

// Updates a book with newly-inputted details
router.put('/:id', async (req, res) => {
    try {
      const { title, authorName, authorBirthYear, genreName, publicationYear, copiesAvailable } = req.body;

      // Find the author by name (or create a new author)
      // MONGODB function findOne({})
      let author = await Author.findOne({ name: authorName });
      if (author) {
        // Update the author's birthYear if it has changed
        if (author.birthYear !== Number(authorBirthYear)) {
          author.birthYear = Number(authorBirthYear);
          await author.save();
        }
      } else {
        author = await Author.create({ name: authorName, birthYear: Number(authorBirthYear) });
      }

      // Find the genre by name (or create a new genre)
      let genre = await Genre.findOne({ name: genreName });
      if (!genre) {
        genre = await Genre.create({ name: genreName });
      }
      
      // Update the book with the new details.
      const updatedBook = await Book.findByIdAndUpdate(req.params.id, {
        title,
        author: author._id,
        genre: genre._id,
        publicationYear,
        copiesAvailable
      }, { new: true });
      if (!updatedBook) return res.status(404).json({ message: "Book not found" });
      res.json(updatedBook);
    } catch (error) {
      res.status(500).json({ message: "Error updating book", error });
    }
});

module.exports = router;