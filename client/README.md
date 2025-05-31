# Personal Finance Tracker Frontend

A modern, responsive web application for tracking personal finances, built with React, TypeScript, and Tailwind CSS.


## Features

- Dashboard with financial overview
- Income and expense tracking
- Visual reports and analytics
- Advanced transaction filtering
- Responsive design for all devices
- Secure authentication
- Export data to CSV and PDF

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Recharts for data visualization
- React Router for navigation
- Axios for API requests
- React Hot Toast for notifications

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── charts/        # Chart components
│   ├── dashboard/     # Dashboard-specific components
│   └── layout/        # Layout components
├── contexts/          # React context providers
├── pages/             # Page components
├── services/          # API services
```

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v18 or higher)
- npm (v9 or higher)

## Environment Variables

Create a `.env` file in the root directory with these variables:

```env
VITE_API_URL=your_backend_api_url
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`



The build files will be available in the `dist` directory.




## Key Components

- `AuthContext`: Handles user authentication
- `TransactionContext`: Manages transaction state
- `Dashboard`: Main dashboard with financial overview
- `Transactions`: Transaction management interface
- `Reports`: Financial reports and analytics

## Authentication

The application uses JWT-based authentication. Tokens are stored in localStorage and automatically included in API requests through an Axios interceptor.

## Data Visualization

Charts are implemented using Recharts:
- Bar charts for monthly income/expense trends
- Doughnut charts for category-wise breakdowns
- Interactive tooltips and legends

## Styling

- Tailwind CSS for utility-first styling
- Custom color scheme and components
- Responsive design breakpoints
- Dark mode support (coming soon)

## Error Handling

- Toast notifications for user feedback
- Form validation
- API error handling
- Protected routes

