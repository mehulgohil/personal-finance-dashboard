# Personal Finance Dashboard API Documentation

This document outlines the API endpoints for the personal finance dashboard backend server.

**Base URL**: `http://localhost:3001/api`

---

### 1. Get All Financial Data

Retrieves the entire dataset of monthly financial records.

- **URL**: `/data`
- **Method**: `GET`
- **Request Body**: None
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**: An array of `MonthlyData` objects.
    ```json
    [
      {
        "date": "31/01/24",
        "assets": { "Mutual Funds": 50000, "Stocks": 82000 },
        "liabilities": { "Home Loan": 2995000 }
      }
    ]
    ```

---

### 2. Update a Data Entry

Updates the value for a specific category in a specific month.

- **URL**: `/data/entry`
- **Method**: `PUT`
- **Request Body**:
  ```json
  {
    "date": "31/01/24",
    "type": "assets",
    "category": "Stocks",
    "value": 85000
  }
  ```
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**: `{ "message": "Entry updated successfully" }`
- **Error Response**:
  - **Code**: `404 Not Found`
  - **Content**: `{ "message": "Month or category not found" }`

---

### 3. Add a New Category

Adds a new category (e.g., "Crypto") to either assets or liabilities for all existing months, initialized with a value of 0.

- **URL**: `/data/category`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "type": "assets",
    "category": "Crypto"
  }
  ```
- **Success Response**:
  - **Code**: `201 Created`
  - **Content**: `{ "message": "Category added successfully" }`

---

### 4. Remove a Category

Removes a category from assets or liabilities across all existing months.

- **URL**: `/data/category`
- **Method**: `DELETE`
- **Request Body**:
  ```json
  {
    "type": "assets",
    "category": "Stocks"
  }
  ```
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**: `{ "message": "Category removed successfully" }`

---

### 5. Add a New Month

Adds a new month to the dataset. The new month's values are copied from the most recent existing month.

- **URL**: `/data/month`
- **Method**: `POST`
- **Request Body**: None
- **Success Response**:
  - **Code**: `201 Created`
  - **Content**: `{ "message": "New month added successfully" }`

---

### 6. Reset All Data

Resets all financial data back to the initial demo data.

- **URL**: `/data/reset`
- **Method**: `POST`
- **Request Body**: None
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**: `{ "message": "Data reset successfully" }`
