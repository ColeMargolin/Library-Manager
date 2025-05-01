import React, { useState } from 'react';
import axios from 'axios';

// This React component creates a form that allows the user to add a new book to the database
// When the form is submitted & a new book is added, it sends a POST request through express to the backend

const BookForm = ({ onBookAdded }) => {
    // Local state for each input field in the form
    const [title, setTitle] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [authorBirthYear, setAuthorBirthYear] = useState('');
    const [genreName, setGenreName] = useState('');
    const [publicationYear, setPublicationYear] = useState('');
    const [copiesAvailable, setCopiesAvailable] = useState('');

    // Ensures that all required fields are filled, converts numeric fields, and sends a POST request
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Sending book:", { title, authorName, authorBirthYear, genreName, publicationYear, copiesAvailable });

        // Validates that all fields are filled
        if (!title || !authorName || !authorBirthYear || !genreName || !publicationYear || !copiesAvailable) {
            alert("All fields are required!");
            return;
        }

        try {
            // Send a POST request to the backend API to create a new book.
            const response = await axios.post('http://localhost:5000/api/books', {
                title,
                authorName,
                authorBirthYear: Number(authorBirthYear),
                genreName,
                publicationYear: Number(publicationYear),
                copiesAvailable: Number(copiesAvailable)
            });
            console.log("Response received:", response.data);
            // Call the onBookAdded callback (from the parent component) with the new book data
            onBookAdded(response.data);
            // Clears the form's fields after successful submission
            setTitle('');
            setAuthorName('');
            setAuthorBirthYear('');
            setGenreName('');
            setPublicationYear('');
            setCopiesAvailable('');
        } catch (error) {
            console.error("Error sending book:", error);
        }
    };

    // Displays the Add Book Feature (form) on the Home tab above the Book List
    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <input type="text" placeholder="Author Name" value={authorName} onChange={(e) => setAuthorName(e.target.value)} required />
            <input type="number" placeholder="Author Birth Year" value={authorBirthYear} onChange={(e) => setAuthorBirthYear(e.target.value)} />
            <input type="text" placeholder="Genre" value={genreName} onChange={(e) => setGenreName(e.target.value)} required />
            <input type="number" placeholder="Publication Year" value={publicationYear} onChange={(e) => setPublicationYear(e.target.value)} required />
            <input type="number" placeholder="Copies Available" value={copiesAvailable} onChange={(e) => setCopiesAvailable(e.target.value)} required />
            <button type="submit">Add Book</button>
        </form>
    );
};

export default BookForm;