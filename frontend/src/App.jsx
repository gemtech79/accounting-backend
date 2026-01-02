import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Tenants from './components/Tenants';
import ChartOfAccounts from './components/ChartOfAccounts';
import JournalEntries from './components/JournalEntries';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/tenants">Tenants</Link></li>
            <li><Link to="/chart-of-accounts">Chart of Accounts</Link></li>
            <li><Link to="/journal-entries">Journal Entries</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/tenants" element={<Tenants />} />
          <Route path="/chart-of-accounts" element={<ChartOfAccounts />} />
          <Route path="/journal-entries" element={<JournalEntries />} />
          <Route path="/" element={<h1>Welcome to Accounting App</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
