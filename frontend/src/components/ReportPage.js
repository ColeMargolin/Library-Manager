import React, { useState } from 'react';
import axios from 'axios';

// This component provides a form for filtering books based on author name, genre, and publication year range
// It displays the filtered results or an error message if no filters are provided or no matches are found

const ReportPage = () => {    
    const [filters, setFilters] = useState({ authorName: '', genreName: '', startYear: '', endYear: '' }); // holds the search criteria entered by the user
    const [books, setBooks] = useState([]);  // holds the filtered results from the backend
    const [error, setError] = useState(''); // holds any error messages to display

    // sends a GET request with query parameters based on filters
    // sets error message if no filters are provided or no books are found
    const fetchFilteredBooks = async () => {
        try {
            const queryParams = {};
            if (filters.authorName) queryParams.authorName = filters.authorName;
            if (filters.genreName) queryParams.genreName = filters.genreName;
            if (filters.startYear) queryParams.startYear = filters.startYear;
            if (filters.endYear) queryParams.endYear = filters.endYear;

            // Alerts user if no filters are provided
            if (Object.keys(queryParams).length === 0) {
                setError("Please enter at least one filter parameter.");
                setBooks([]); // Clears books state when no filters are entered
                return;
            }

            setError("");
            const response = await axios.get('http://localhost:5000/api/books/filter', { params: queryParams });
            if (response.data.length === 0) {
                setError("No results found.");
            }
            setBooks(response.data); // Puts filtered book results into books state
        } catch (error) {
            setError(error.response?.data?.message || "Error fetching books.");
            setBooks([]); // Clears books state on error
        }
    };

    // Displays the Book Report form and filtered results upon query
    // Component calls "fetchFilteredBooks" upon clicking the Generate Report button
    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>Book Report</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <label>Author Name: </label>
            <input type="text" value={filters.authorName} onChange={e => setFilters({ ...filters, authorName: e.target.value })} />
            <br />

            <label>Genre Name: </label>
            <input type="text" value={filters.genreName} onChange={e => setFilters({ ...filters, genreName: e.target.value })} />
            <br />

            <label>Publication Year Range: </label>
            <input type="number" placeholder="Start Year" value={filters.startYear} onChange={e => setFilters({ ...filters, startYear: e.target.value })} />
            -
            <input type="number" placeholder="End Year" value={filters.endYear} onChange={e => setFilters({ ...filters, endYear: e.target.value })} />
            <br />

            <button onClick={fetchFilteredBooks}>Generate Report</button>

            <h3>Results</h3>
            {books.length > 0 ? (
                <ul>
                    {books.map(book => (
                        <li key={book._id}>
                            {book.title} by {book.author?.name} ({book.publicationYear})
                        </li>
                    ))}
                </ul>
            ) : (
                !error && <p>No results found</p>
            )}
        </div>
    );
};

export default ReportPage;