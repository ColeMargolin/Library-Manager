import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import ReportPage from './components/ReportPage';

// function App() {
//     return (
//         <div style={{ textAlign: 'center', marginTop: '20%' }}>
//             <h1>Book Manager</h1>
//             <BookForm onBookAdded={() => window.location.reload()} />
//             <BookList />
//         </div>
//     );
// }

function App() {
  return (
      <Router>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <h1>Book Manager</h1>
              <nav>
                  <Link to="/">Home</Link> | <Link to="/report">Report</Link>
              </nav>
              <Routes>
                  <Route path="/" element={
                      <>
                          <BookForm onBookAdded={() => window.location.reload()} />
                          <BookList />
                      </>
                  } />
                  <Route path="/report" element={<ReportPage />} />
              </Routes>
          </div>
      </Router>
  );
}

export default App;
