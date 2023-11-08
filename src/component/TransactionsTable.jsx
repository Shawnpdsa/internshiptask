import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionsTable = () => {
  const [selectedMonth, setSelectedMonth] = useState(3); // Default to March
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [transactions, setTransactions] = useState([]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchTransactions(selectedMonth, searchText);
  };

  const handleClear = () => {
    setSearchText('');
    setCurrentPage(1);
    fetchTransactions(selectedMonth, '');
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    fetchTransactions(selectedMonth, searchText);
  }, [selectedMonth, searchText, currentPage]);

  const fetchTransactions = async (month, search) => {
    try {
      const response = await axios.get(`/list-transactions?month=${month}&search=${search}&page=${currentPage}`);
      setTransactions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Transactions Table</h1>
      <label htmlFor="monthSelect">Select Month:</label>
      <select id="monthSelect" value={selectedMonth} onChange={handleMonthChange}>
        {/* Options for Jan to Dec */}
      </select>
      <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search Transactions" />
      <button onClick={handleSearch}>Search</button>
      <button onClick={handleClear}>Clear</button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{transaction.category}</td>
              <td>{transaction.sold}</td>
              <td>{transaction.image}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handlePrevious}>Previous</button>
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default TransactionsTable;