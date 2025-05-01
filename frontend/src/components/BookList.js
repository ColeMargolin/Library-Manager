import React, { useState, useEffect } from 'react';
import axios from 'axios';

// This component fetches & displays a list of books from the backend, allowing editing and deletion

const BookList = () => {
    const [books, setBooks] = useState([]); // State that holds list of books from the database
    const [editBook, setEditBook] = useState(null); // State that holds currently selected books to edit

    useEffect(() => {
        fetchBooks(); // Immediately fetch & display list of books when the component mounts
    }, []);

    // Makes a GET request to retrieve all books from the backend
    const fetchBooks = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/books');
            setBooks(res.data); // Updates state with the fetched books
        } catch (err) {
            console.error("Error fetching books:", err);
        }
    };

    // Called when user clicks "Edit" button
    // Pre-fills edit form with selected book's details
    const handleEdit = (book) => {
        setEditBook({ ...book, authorName: book.author.name, authorBirthYear: book.author.birthYear, genreName: book.genre.name });
    };

    // Sends a PUT request to update the book in the database & redisplays updated values
    const handleUpdate = async () => {
        // Send updated book details to the backend
        try {
            await axios.put(`http://localhost:5000/api/books/${editBook._id}`, {
                title: editBook.title,
                authorName: editBook.authorName,
                authorBirthYear: Number(editBook.authorBirthYear),
                genreName: editBook.genreName,
                publicationYear: Number(editBook.publicationYear),
                copiesAvailable: Number(editBook.copiesAvailable)
            });
            fetchBooks(); // refreshes Book List after updating
            setEditBook(null); // Clears the edit form
        } catch (error) {
            console.error("Error updating book:", error);
        }
    };

    // Sends a DELETE request with express to remove book from database
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/books/${id}`);
            fetchBooks();
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    };

    // Displays an unordered list of Books (with the edit & delete button on the side)
    // If edit button is clicked, also returns the edit menu
    return (
        <div>
            <h2>Book List</h2>
            <ul>
                {books.length > 0 ? (
                    books.map(book => (
                        <li key={book._id}>
                            {book.title} by {book.author?.name} ({book.publicationYear})
                            <button onClick={() => handleEdit(book)}>Edit</button>
                            <button onClick={() => handleDelete(book._id)}>Delete</button>
                        </li>
                    ))
                ) : (
                    <p>No books available</p>
                )}
            </ul>

            {editBook && (
                <div>
                    <h3>Edit Book</h3>
                    <input value={editBook.title} onChange={e => setEditBook({ ...editBook, title: e.target.value })} placeholder="Title" />
                    <input value={editBook.authorName} onChange={e => setEditBook({ ...editBook, authorName: e.target.value })} placeholder="Author Name" />
                    <input value={editBook.authorBirthYear} onChange={e => setEditBook({ ...editBook, authorBirthYear: e.target.value })} placeholder="Author Birth Year" type="number" />
                    <input value={editBook.genreName} onChange={e => setEditBook({ ...editBook, genreName: e.target.value })} placeholder="Genre" />
                    <input value={editBook.publicationYear} onChange={e => setEditBook({ ...editBook, publicationYear: e.target.value })} placeholder="Publication Year" type="number" />
                    <input value={editBook.copiesAvailable} onChange={e => setEditBook({ ...editBook, copiesAvailable: e.target.value })} placeholder="Copies Available" type="number" />
                    <button onClick={handleUpdate}>Update</button>
                </div>
            )}
        </div>
    );
};

export default BookList;