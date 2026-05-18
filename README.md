# 💰 Personal Finance Tracker

A modern, feature-rich personal finance tracking application built with Next.js, React, Redux, and Chart.js.

## ✨ Features

### 📊 Visual Analytics

- Interactive bar charts for income vs expense comparison
- Doughnut charts for overall financial distribution
- Pie charts for category-based expense and income breakdown
- Multiple time frames (daily, weekly, monthly, yearly)
- Toggle between overview and category views

### 💸 Expense & Income Tracking

- Record and manage all transactions with detailed information
- **Categories**: Organize expenses (Food & Dining, Transportation, Shopping, etc.) and income (Salary, Freelance, Investment, etc.)
- **Tags**: Add custom tags for better organization and searchability
- **Edit Transactions**: Modify existing transactions anytime
- **Date Range Filtering**: Filter transactions by custom date ranges
- **Search & Sort**: Find transactions by title, description, or tags
- **Recurring Transactions**: Set up daily, weekly, monthly, or yearly recurring transactions

### 💰 Budget Management

- Set monthly budgets for each expense category
- Visual progress bars showing budget utilization
- Color-coded warnings (green, yellow, red) based on spending
- Track budget vs actual spending in real-time
- Edit or delete budgets as needed

### 📥 Data Export

- Export all transactions to CSV format
- Includes all transaction details (date, title, category, amount, tags, description)
- Easy data backup and analysis in spreadsheet applications

### 🎨 User Experience

- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode Support**: Automatic dark mode based on system preferences
- **Persistent Storage**: Data saved locally using Redux Persist with automatic migration
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Form Validation**: Comprehensive validation with helpful error messages

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/bbjiggy/personal-finance-tracker.git
cd personal-finance-tracker
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
- **Redux Persist** - Local storage persistence with migrations
- **Chart.js** - Data visualization
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type safety

## 📖 Usage

### Adding Transactions

1. Click "Add Expense" or "Add Income" button
2. Fill in the transaction details:
   - Title (required)
   - Category (required)
   - Amount (required)
   - Date (required)
   - Tags (optional, comma-separated)
   - Description (optional)
   - Recurring (optional, with frequency selection)
3. Click "Create" to save

### Editing Transactions

1. Click the "Edit" button on any transaction
2. Modify the details as needed
3. Click "Update" to save changes

### Managing Budgets

1. Navigate to the "Budget" tab
2. Click "Add Budget"
3. Select category, set amount, and choose month
4. Monitor spending with visual progress bars
5. Edit or delete budgets as needed

### Viewing Statistics

- Switch between "Overview" and "Categories" chart views
- In Overview: Select time frames (Daily, Weekly, Monthly, Yearly)
- In Categories: View pie charts for expense and income distribution
- Check summary cards for totals and balance

### Filtering & Searching

- Use the search bar to find transactions by title, description, or tags
- Filter by category using the dropdown
- Set date ranges to view transactions within specific periods
- Sort by date or amount

### Exporting Data

- Click the "Export to CSV" button
- All transactions (expenses and income) will be downloaded
- File includes: Date, Title, Category, Amount, Type, Description, Tags

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
- Quick access to add transactions

### Transaction Management

- Add, edit, view, and delete transactions
- Category-based organization
- Tag system for flexible categorization
- Search and filter capabilities
- Sort by date or amount
- Date range filtering
- Detailed transaction cards with all information

### Budget Planning

- Category-based budget setting
- Monthly budget tracking
- Visual progress indicators
- Over-budget warnings
- Budget vs actual comparison

### Data Visualization

- Bar charts for comparative analysis
- Doughnut charts for distribution
- Pie charts for category breakdown
- Multiple time frame options
- Responsive chart sizing
- Toggle between different views

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

- Multi-currency support
- Cloud sync across devices
- Budget alerts and notifications
- Savings goals tracking
- Bill reminders
- Receipt photo attachments
- Advanced analytics and insights
- Custom category creation
- Shared budgets for families
