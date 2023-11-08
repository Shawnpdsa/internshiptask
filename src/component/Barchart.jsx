
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2'; 

const Barchart = () => {
  const [selectedMonth, setSelectedMonth] = useState(3); // Default to March
  const [priceRanges, setPriceRanges] = useState([]);
  const [data, setData] = useState({});

  useEffect(() => {
    fetchBarChartData(selectedMonth);
  }, [selectedMonth]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const fetchBarChartData = async (month) => {
    try {
      const response = await axios.get(`/bar-chart?month=${month}`);
      setPriceRanges(response.data);

      // Prepare the data for the bar chart
      const labels = response.data.map((range) => range.range);
      const values = response.data.map((range) => range.count);

      setData({
        labels,
        datasets: [
          {
            label: 'Number of Items',
            data: values,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Transactions Bar Chart</h2>
      <label htmlFor="monthSelect">Select Month:</label>
      <select id="monthSelect" value={selectedMonth} onChange={handleMonthChange}>
        {/* Options for Jan to Dec */}
      </select>

      <div>
        <Bar
          data={data}
          options={{
            scales: {
              y: { beginAtZero: true },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Barchart;