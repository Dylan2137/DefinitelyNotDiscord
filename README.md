# DefinitelyNotDiscord

A React + Vite + Electron + Express chat application.

## Getting Started

### Prerequisites

- Node.js installed.
- MySQL server running with a database named `Electron`.
- Database user `draedon` with password `1509` (configured in `server/db.js`).

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the backend server, the Vite development server, and the Electron application concurrently, run:
```bash
npm start
```

If you need to start them individually:
- Backend server: `npm run server`
- Vite frontend: `npm run app`
- Electron: `npm run electron`

## Troubleshooting

### Failed to fetch / Could not connect to the server
This error usually means the backend server is not running or is unreachable. Ensure you have run `npm start` (or `npm run server` separately) and that your MySQL database is correctly configured and accessible.

## original Vite README content:
