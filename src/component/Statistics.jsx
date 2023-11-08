import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statistics = () => {
  const [selectedMonth, setSelectedMonth] = useState(3); // Default to March
  const [totalSaleAmount, setTotalSaleAmount] = useState(0);
  const [totalSoldItems, setTotalSoldItems] = useState(0);
  const [totalNotSoldItems, setTotalNotSoldItems] = useState(0);

  useEffect(() => {
    fetchStatistics(selectedMonth);
  }, [selectedMonth]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const fetchStatistics = async (month) => {
    try {
      const response = await axios.get(`/statistics?month=${month}`);
      setTotalSaleAmount(response.data.totalSaleAmount);
      setTotalSoldItems(response.data.totalSoldItems);
      setTotalNotSoldItems(response.data.totalNotSoldItems);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Transactions Statistics</h2>
      <label htmlFor="monthSelect">Select Month:</label>
      <select id="monthSelect" value={selectedMonth} onChange={handleMonthChange}>
         {/* Options for Jan to Dec  */}
      </select>

      <div>
        <div>Total Sale Amount: {totalSaleAmount}</div>
        <div>Total Sold Items: {totalSoldItems}</div>
        <div>Total Not Sold Items: {totalNotSoldItems}</div>
      </div>
    </div>
  );
};

export default Statistics;