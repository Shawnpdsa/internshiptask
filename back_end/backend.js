const express = require('express');
const axios = require('axios');
const app = express();
const port = 4000;

// In-memory database to store the seed data
let productTransactions = [];

// Initialize the database with seed data from the third-party API
app.get('/initialize-database', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        productTransactions = response.data;
        res.send('Database initialized with seed data.');
    } catch (error) {
        res.status(500).send('Failed to initialize the database.');
    }
});

// Listing all transactions with search and pagination
app.get('/list-transactions', (req, res) => {
    const { page = 1, perPage = 10, search = '' } = req.query;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    
    const filteredTransactions = productTransactions
        .filter(transaction => {
            const { productTitle, description, price } = transaction;
            const searchLower = search.toLowerCase();
            return (
                productTitle.toLowerCase().includes(searchLower) ||
                description.toLowerCase().includes(searchLower) ||
                price.toString().toLowerCase().includes(searchLower)
            );
        });

    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

    res.json(paginatedTransactions);
});

// Calculating statistics for a selected month
app.get('/statistics', (req, res) => {
    const { month } = req.query;
    const selectedMonthTransactions = productTransactions.filter(transaction => {
        const dateOfSale = new Date(transaction.dateOfSale);
        return dateOfSale.getMonth() + 1 === month; // +1 because months are 0-based
    });

    const totalSaleAmount = selectedMonthTransactions.reduce((total, transaction) => total + transaction.price, 0);
    const totalSoldItems = selectedMonthTransactions.length;
    const totalNotSoldItems = productTransactions.length - totalSoldItems;

    res.json({
        totalSaleAmount,
        totalSoldItems,
        totalNotSoldItems,
    });
});

// creating bar chart API

app.get('/bar-chart', (req, res) => {
    const { month } = req.query;
    const selectedMonthTransactions = productTransactions.filter(transaction => {
        const dateOfSale = new Date(transaction.dateOfSale);
        return dateOfSale.getMonth() + 1 === month; // +1 because months are 0-based
    });

    const priceRanges = [
        { range: '0 - 100', count: 0 },
        { range: '101 - 200', count: 0 },
        { range: '201 - 300', count: 0 },
        { range: '301 - 400', count: 0 },
        { range: '401 - 500', count: 0 },
        { range: '501 - 600', count: 0 },
        { range: '601 - 700', count: 0 },
        { range: '701 - 800', count: 0 },
        { range: '801 - 900', count: 0 },
        { range: '901-above', count: 0 },
    ];

    selectedMonthTransactions.forEach(transaction => {
        const price = transaction.price;
        if (price <= 100) priceRanges[0].count++;
        else if (price <= 200) priceRanges[1].count++;
        else if (price <= 300) priceRanges[2].count++;
        else if (price <= 400) priceRanges[3].count++;
        else if (price <= 500) priceRanges[4].count++;
        else if (price <= 600) priceRanges[5].count++;
        else if (price <= 700) priceRanges[6].count++;
        else if (price <= 800) priceRanges[7].count++;
        else if (price <= 900) priceRanges[8].count++;
        else priceRanges[9].count++;
    });

    res.json(priceRanges);
});

// Pie chart API
app.get('/pie-chart', (req, res) => {
    const { month } = req.query;
    const selectedMonthTransactions = productTransactions.filter(transaction => {
        const dateOfSale = new Date(transaction.dateOfSale);
        return dateOfSale.getMonth() + 1 === month; // +1 because months are 0-based
    });

    const categoryCounts = {};

    selectedMonthTransactions.forEach(transaction => {
        const category = transaction.category;
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    res.json(categoryCounts);
});

// Combined JSON API
app.get('/combined-json', (req, res) => {
    const { month } = req.query;

    const statistics = {
        ...calculateStatistics(month),
        barChart: calculateBarChart(month),
        pieChart: calculatePieChart(month),
    };

    res.json(statistics);
});

function calculateStatistics(month) {
    app.get('/statistics', (req, res) => {
        const { month } = req.query;
        const selectedMonthTransactions = productTransactions.filter(transaction => {
            const dateOfSale = new Date(transaction.dateOfSale);
            return dateOfSale.getMonth() + 1 === month; // +1 because months are 0-based
        });
    
        const totalSaleAmount = selectedMonthTransactions.reduce((total, transaction) => total + transaction.price, 0);
        const totalSoldItems = selectedMonthTransactions.length;
        const totalNotSoldItems = productTransactions.length - totalSoldItems;
    
        res.json({
            totalSaleAmount,
            totalSoldItems,
            totalNotSoldItems,
        });
    });
}

function calculateBarChart(month) {
    app.get('/bar-chart', (req, res) => {
        const { month } = req.query;
        const selectedMonthTransactions = productTransactions.filter(transaction => {
            const dateOfSale = new Date(transaction.dateOfSale);
            return dateOfSale.getMonth() + 1 === month; // +1 because months are 0-based
        });
    
        const priceRanges = [
            { range: '0 - 100', count: 0 },
            { range: '101 - 200', count: 0 },
            { range: '201 - 300', count: 0 },
            { range: '301 - 400', count: 0 },
            { range: '401 - 500', count: 0 },
            { range: '501 - 600', count: 0 },
            { range: '601 - 700', count: 0 },
            { range: '701 - 800', count: 0 },
            { range: '801 - 900', count: 0 },
            { range: '901-above', count: 0 },
        ];
    
        selectedMonthTransactions.forEach(transaction => {
            const price = transaction.price;
            if (price <= 100) priceRanges[0].count++;
            else if (price <= 200) priceRanges[1].count++;
            else if (price <= 300) priceRanges[2].count++;
            else if (price <= 400) priceRanges[3].count++;
            else if (price <= 500) priceRanges[4].count++;
            else if (price <= 600) priceRanges[5].count++;
            else if (price <= 700) priceRanges[6].count++;
            else if (price <= 800) priceRanges[7].count++;
            else if (price <= 900) priceRanges[8].count++;
            else priceRanges[9].count++;
        });
    
        res.json(priceRanges);
    });
}    

function calculatePieChart(month) {
    app.get('/pie-chart', (req, res) => {
        const { month } = req.query;
        const selectedMonthTransactions = productTransactions.filter(transaction => {
            const dateOfSale = new Date(transaction.dateOfSale);
            return dateOfSale.getMonth() + 1 === month; // +1 because months are 0-based
        });
    
        const categoryCounts = {};
    
        selectedMonthTransactions.forEach(transaction => {
            const category = transaction.category;
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });
    
        res.json(categoryCounts);
    });
}



app.listen(port, (err) => {
    if(err){
        console.log(err);
    }
    console.log(`Server is running on port ${port}`);
});