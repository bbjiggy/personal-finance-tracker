# 💰 Personal Finance Tracker

A modern, responsive personal finance tracking application built with Next.js, React, Redux, and Chart.js.

## ✨ Features

- **📊 Visual Analytics**: Interactive bar and doughnut charts to visualize your financial data
- **💸 Expense Tracking**: Record and manage all your expenses with detailed information
- **💵 Income Tracking**: Keep track of all income sources
- **📱 Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **🌓 Dark Mode Support**: Automatic dark mode based on system preferences
- **🔍 Search & Filter**: Easily find transactions with search and sort functionality
- **💾 Persistent Storage**: Data is saved locally using Redux Persist
- **📈 Multiple Time Frames**: View statistics by day, week, month, or year
- **🎨 Modern UI**: Clean, intuitive interface with smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd expense-tracking
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Built With

- **Next.js 15** - React framework for production
- **React 18** - UI library
- **Redux Toolkit** - State management
- **Redux Persist** - Local storage persistence
- **Chart.js** - Data visualization
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type safety

## 📖 Usage

### Adding Transactions

1. Click "Add Expense" or "Add Income" button
2. Fill in the transaction details:
   - Title (required)
   - Amount (required)
   - Date (required)
   - Description (optional)
3. Click "Create" to save

### Viewing Statistics

- Switch between different time frames (Daily, Weekly, Monthly, Yearly)
- View bar chart for expense vs income comparison
- Check doughnut chart for overall distribution
- See summary cards for totals and balance

### Managing Transactions

- Use the search bar to find specific transactions
- Sort by date or amount
- Delete transactions with the delete button
- Switch between Expenses and Income tabs

### Customizing Your Profile

- Click on your profile avatar in the navbar
- Edit your username
- Press Enter or click the checkmark to save

## 📱 Responsive Design

The application is fully responsive and optimized for:

- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1280px+)

## 🎨 Features Breakdown

### Dashboard

- Real-time balance calculation
- Color-coded summary cards
- Interactive charts with multiple views

### Transaction Management

- Add, view, and delete transactions
- Search and filter capabilities
- Sort by date or amount
- Detailed transaction cards

### Data Visualization

- Bar charts for comparative analysis
- Doughnut charts for distribution
- Multiple time frame options
- Responsive chart sizing

## 🔧 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 💡 Future Enhancements

- Export data to CSV/PDF
- Budget planning and alerts
- Category-based expense tracking
- Recurring transactions
- Multi-currency support
- Cloud sync across devices
