const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// --- In-Memory Database ---
// For a real application, you would replace this with a connection to a database like PostgreSQL, MongoDB, etc.
let financialData = [];
const initialDataPath = path.join(__dirname, 'initialData.json');

// Function to load initial data
const loadInitialData = () => {
    try {
        const rawData = fs.readFileSync(initialDataPath);
        return JSON.parse(rawData);
    } catch (error) {
        console.error("Could not read or parse initialData.json:", error);
        // Fallback to an empty array if the file is missing or corrupt
        return []; 
    }
};

// Initialize data
const INITIAL_DATA = loadInitialData();
financialData = JSON.parse(JSON.stringify(INITIAL_DATA)); // Deep copy to allow reset


// --- Middleware ---
app.use(cors()); // Allows requests from your frontend (running on a different port)
app.use(express.json()); // Parses incoming JSON requests


// --- API Endpoints ---

// GET /api/data
// Retrieves all financial data
app.get('/api/data', (req, res) => {
    console.log('GET /api/data - Sending all financial data');
    res.json(financialData);
});

// PUT /api/data/entry
// Updates a single data entry (a cell in the table)
app.put('/api/data/entry', (req, res) => {
    const { date, type, category, value } = req.body;
    console.log(`PUT /api/data/entry - Updating ${type}.${category} for ${date} to ${value}`);
    
    const month = financialData.find(m => m.date === date);

    if (month && month[type]) {
        month[type][category] = Number(value);
        res.status(200).json({ message: 'Entry updated successfully' });
    } else {
        res.status(404).json({ message: 'Month or category not found' });
    }
});

// POST /api/data/category
// Adds a new asset or liability category to all months
app.post('/api/data/category', (req, res) => {
    const { type, category } = req.body;
    console.log(`POST /api/data/category - Adding new category "${category}" to ${type}`);
    
    financialData.forEach(month => {
        if (!month[type]) {
            month[type] = {};
        }
        month[type][category] = 0; // Initialize with 0
    });

    res.status(201).json({ message: 'Category added successfully' });
});

// DELETE /api/data/category
// Removes a category from all months
app.delete('/api/data/category', (req, res) => {
    const { type, category } = req.body;
    console.log(`DELETE /api/data/category - Removing category "${category}" from ${type}`);

    financialData.forEach(month => {
        if (month[type]) {
            delete month[type][category];
        }
    });

    res.status(200).json({ message: 'Category removed successfully' });
});

// POST /api/data/month
// Adds a new month, carrying over values from the last month
app.post('/api/data/month', (req, res) => {
    console.log('POST /api/data/month - Adding a new month');
    if (financialData.length === 0) {
        return res.status(400).json({ message: 'Cannot add a month to empty data.' });
    }

    const lastData = financialData[financialData.length - 1];
    const lastDateParts = lastData.date.split('/');
    const lastDate = new Date(parseInt(lastDateParts[2], 10) + 2000, parseInt(lastDateParts[1], 10) - 1, parseInt(lastDateParts[0], 10));
    
    lastDate.setMonth(lastDate.getMonth() + 1);
    const newMonthDate = new Date(lastDate.getFullYear(), lastDate.getMonth() + 1, 0); // Last day of new month

    const newDate = `${String(newMonthDate.getDate()).padStart(2, '0')}/${String(newMonthDate.getMonth() + 1).padStart(2, '0')}/${String(newMonthDate.getFullYear()).slice(-2)}`;

    const newMonthData = JSON.parse(JSON.stringify(lastData)); // Deep copy previous month's data
    newMonthData.date = newDate;

    financialData.push(newMonthData);
    res.status(201).json({ message: 'New month added successfully' });
});

// POST /api/data/reset
// Resets the data to the initial state
app.post('/api/data/reset', (req, res) => {
    console.log('POST /api/data/reset - Resetting data to initial state');
    financialData = JSON.parse(JSON.stringify(INITIAL_DATA)); // Deep copy
    res.status(200).json({ message: 'Data reset successfully' });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});

// --- Helper Data File ---
// Create initialData.json if it doesn't exist to avoid startup errors
if (!fs.existsSync(initialDataPath)) {
    const defaultData = [
      {
        date: '31/01/24',
        assets: {
          'Mutual Funds': 50000, 'Stocks': 82000, 'Retirement Fund': 205000, 'Savings Account': 100000, 'Real Estate': 5000000,
        },
        liabilities: {
          'Home Loan': 2995000, 'Car Loan': 195000, 'Credit Card Debt': 25000,
        },
      },
      {
        date: '29/02/24',
        assets: {
          'Mutual Funds': 53000, 'Stocks': 85000, 'Retirement Fund': 210000, 'Savings Account': 102000, 'Real Estate': 5000000,
        },
        liabilities: {
          'Home Loan': 2990000, 'Car Loan': 190000, 'Credit Card Debt': 18000,
        },
      },
    ];
    fs.writeFileSync(initialDataPath, JSON.stringify(defaultData, null, 2));
    console.log('Created initialData.json with default data.');
    financialData = JSON.parse(JSON.stringify(defaultData));
}
