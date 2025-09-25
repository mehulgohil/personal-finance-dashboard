# Personal Finance Dashboard

This is a full-stack web application designed to help you track, visualize, and analyze your personal financial health. It provides a clear and interactive dashboard to manage your monthly assets and liabilities, view trends over time, and understand your financial standing at a glance.

![image](https://storage.googleapis.com/aistudio-public/gallery/a8c6a086-630d-4ab0-b494-0df5e6e300ac/S2_v2.png)

---

## Features

- **Interactive Data Table:** Easily input and edit your financial data for each month.
- **Dynamic Categories:** Add or remove custom categories for both assets and liabilities to tailor the dashboard to your specific needs.
- **Data Persistence:** All data is managed through a backend Node.js server, ensuring your information is saved.
- **Rich Visualizations:**
    - **Summary Cards:** See your latest Net Worth, Total Assets, and Total Liabilities with a month-over-month percentage change.
    - **Net Worth Over Time:** A bar chart tracking your net worth, assets, and liabilities across months.
    - **Asset & Liability Allocation:** Donut charts showing the breakdown of your assets and liabilities for the most recent month.
    - **Asset Composition Trend:** A stacked area chart visualizing how your asset mix has evolved.
- **Add/Reset Functionality:** Easily add a new month (which carries over the previous month's data) or reset all data back to the initial demo state.

---

## Tech Stack

- **Frontend:**
  - **React:** A JavaScript library for building user interfaces.
  - **TypeScript:** Adds static typing to JavaScript for improved scalability and developer experience.
  - **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
  - **Recharts:** A composable charting library built on React components.
- **Backend:**
  - **Node.js:** A JavaScript runtime for building the server.
  - **Express:** A minimal and flexible Node.js web application framework for creating the API.
  - **CORS:** Middleware to enable cross-origin requests from the frontend.

---

## Getting Started

To run this application locally, you need to have [Node.js](https://nodejs.org/) (which includes npm) installed.

### 1. Setup

1.  **Download Files:** Place all the project files (`.html`, `.tsx`, `.ts`, `.js`, `.json`, `.md`) into a single directory on your local machine.

2.  **Install Backend Dependencies:** Open a terminal or command prompt, navigate to your project directory, and run the following command to install the necessary server packages:
    ```bash
    npm install
    ```

### 2. Running the Application

The application consists of two parts that must be running simultaneously: the backend server and the frontend client.

1.  **Start the Backend Server:**
    In your terminal, run the following command:
    ```bash
    node server.js
    ```
    You should see a confirmation message: `Server is listening on http://localhost:3001`. The backend is now running and ready to accept requests.

2.  **Start the Frontend:**
    The frontend is a static set of files (`index.html`, etc.) that needs to be served by a simple web server. You can use any static file server you prefer. A common and easy way is using `npx serve`.

    Open a **new terminal window** in the same project directory and run:
    ```bash
    npx serve
    ```
    This will start a local server, typically on a port like `http://localhost:3000`. Your terminal will provide you with the exact address.

3.  **View the Application:**
    Open your web browser and navigate to the address provided by the `serve` command (e.g., `http://localhost:3000`). The Personal Finance Dashboard should now be fully functional.

---

## API Documentation

The backend provides a RESTful API for all data operations. For detailed information about each endpoint, please see the [API.md](./API.md) file.
