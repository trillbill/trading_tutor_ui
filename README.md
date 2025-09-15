# Trading Tutor UI

A comprehensive trading education platform built with React. This frontend application provides an interactive learning experience for traders of all levels, featuring AI-powered chat assistance, progress tracking, and personalized learning paths.

## Features

### 📚 Educational Content
- **Interactive Lessons** - Structured learning modules covering trading fundamentals
- **Video Content** - Embedded video lessons with progress tracking
- **Quiz System** - Interactive quizzes to test knowledge retention
- **Risk Assessment** - Personalized risk appetite evaluation

### 🤖 AI-Powered Features
- **AI Chat Assistant** - Intelligent trading tutor with context-aware responses
- **Personalized Prompts** - Custom chat prompts based on user progress
- **Learning Recommendations** - AI driven content suggestions

### 📊 Trading Tools
- **Trading Journal** - Track and analyze trading performance
- **Chart Integration** - Interactive charts using Lightweight Charts library
- **Performance Analytics** - Visual performance metrics and statistics
- **Currency Settings** - Multi-currency support and conversion

### 🔐 User Management
- **Authentication System** - Secure user registration and login
- **Email Verification** - Account verification workflow
- **Password Reset** - Secure password recovery system
- **User Profiles** - Personalized user accounts and settings

### 💳 Credit System
- **Credit-Based Access** - Usage based credit system
- **Credit Display** - Real time credit balance tracking

### 🎨 Modern UI/UX
- **Responsive Design** - Mobile-first responsive layout
- **Progress Tracking** - Visual progress indicators and completion status

## Technology Stack

- **Frontend**: React 19 + JavaScript
- **Routing**: React Router DOM v7
- **Charts**: Lightweight Charts, Recharts
- **Icons**: Font Awesome, React Icons
- **HTTP Client**: Axios
- **Markdown**: React Markdown with sanitization
- **Build Tool**: Create React App
- **Styling**: CSS3 with modern features

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AIChatModal.js   # AI chat interface
│   ├── ChartDisplay.js  # Trading chart components
│   ├── QuizComponent.js # Interactive quiz system
│   ├── TradingJournal.js # Trading performance tracking
│   └── ...
├── pages/              # Main application pages
│   ├── Dashboard.js    # User dashboard
│   ├── Learn.js        # Learning modules
│   ├── Login.js        # Authentication
│   └── ...
├── context/            # React Context providers
│   ├── AuthContext.js  # Authentication state
│   ├── AIChatContext.js # AI chat state
│   ├── CreditContext.js # Credit system
│   └── ...
├── utils/              # Utility functions
└── assets/             # Images and static assets
```

## Key Components

### AI Chat System
- Context-aware trading assistant
- Customizable chat prompts
- Integration with learning progress
- Real-time response handling

### Trading Journal
- Performance tracking
- Trade analysis tools
- Visual performance metrics
- Export capabilities

### Quiz System
- Interactive question formats
- Progress tracking
- Immediate feedback
- Knowledge assessment

### Chart Integration
- Real-time price charts
- Technical analysis tools
- Multiple chart types
- Responsive design

## API Integration

This frontend connects to a private backend API that handles:
- User authentication and management
- Learning progress tracking
- AI chat processing
- Credit system management
- Content delivery

**Note**: The backend API repository is currently private and not included in this codebase.

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Available Scripts

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Environment Setup
The application requires environment variables for API endpoints and configuration. These are typically set in a `.env` file (not included in this repository).

## Deployment

The application is built using Create React App and produces a static build that can be deployed to any static hosting service:

```bash
npm run build
```

The `build` folder contains the production-ready files.

## Code Overview

This repository showcases:
- **Modern React Patterns** - Hooks, Context API, and functional components
- **State Management** - Multiple context providers for different features
- **Component Architecture** - Reusable, modular component design
- **API Integration** - Axios-based HTTP client with error handling
- **Responsive Design** - Mobile-first CSS with modern layout techniques
- **User Experience** - Loading states, error handling, and smooth transitions

## Author

**Will Finnegan**
- LinkedIn: [William Finnegan](https://www.linkedin.com/in/william-finnegan-4b64819a)

## License

This project is licensed under the MIT License.

## Acknowledgments

- Create React App for the development tooling
- Lightweight Charts for the charting library
- Font Awesome for the icon system
- All contributors to the open-source libraries used in this project
