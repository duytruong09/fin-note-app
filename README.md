# Fin-Note Mobile App 🎤💰

Voice-enabled expense tracking application built with React Native, Expo, and TypeScript. Track your expenses naturally by speaking or using the intuitive Money Note-style interface.

## ✨ Features

### Core Features
- 🎤 **Voice Input**: Speak naturally to create transactions (powered by OpenAI Whisper + GPT-4)
- 💰 **Manual Entry**: Traditional expense tracking with Money Note-style UX
  - Large category buttons (easy tap targets)
  - Built-in calculator keyboard
  - Quick date selectors
- 📊 **Reports & Analytics**: Visual spending breakdown with interactive charts
- 💳 **Budget Management**: Set budgets per category with real-time progress tracking
- 🎨 **Customization**: 20+ theme colors to personalize your experience
- 🔒 **Security**: Biometric authentication (Face ID/Touch ID)

### Technical Features
- ⚡ **Optimistic Updates**: Instant UI feedback
- 🔄 **Pull to Refresh**: Keep data up-to-date
- ♾️ **Infinite Scroll**: Smooth pagination on transactions list
- 📱 **Responsive**: Adapts to all screen sizes
- 🌐 **Multilingual**: Vietnamese and English support

## 🛠️ Tech Stack

- **Framework**: React Native 0.76 + Expo 52
- **Language**: TypeScript (strict mode)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Routing**: Expo Router (file-based)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **API Client**: Axios with auto token refresh
- **Charts**: Victory Native
- **Animations**: React Native Reanimated
- **Forms**: React Hook Form + Zod validation

## 📁 Project Structure

```
fin-note-app/
├── app/                          # Expo Router screens
│   ├── (auth)/                   # Login, Register
│   ├── (tabs)/                   # Main tabs (Dashboard, Transactions, Voice, Reports, Settings)
│   ├── (modals)/                 # Modals (Add Transaction, Add Budget)
│   └── _layout.tsx               # Root layout with auth flow
│
├── src/
│   ├── components/               # Reusable components
│   │   ├── common/               # Button, Input, Card, Badge, Loading
│   │   ├── transactions/         # TransactionCard, CategoryButton, AmountInput, SummaryCard
│   │   ├── budgets/              # BudgetProgressBar
│   │   ├── reports/              # PieChart, BarChart
│   │   ├── voice/                # WaveformVisualizer
│   │   └── layout/               # SafeAreaWrapper
│   │
│   ├── services/                 # API services
│   │   ├── api-client.ts         # Axios instance with interceptors
│   │   ├── auth.service.ts       # Login, register, logout
│   │   ├── transactions.service.ts
│   │   ├── categories.service.ts
│   │   ├── budgets.service.ts
│   │   ├── reports.service.ts
│   │   ├── voice.service.ts
│   │   └── user-settings.service.ts
│   │
│   ├── store/                    # Zustand state management
│   │   ├── index.ts              # Combined store
│   │   ├── auth-slice.ts         # Auth state
│   │   └── voice-slice.ts        # Voice processing state
│   │
│   ├── hooks/                    # Custom hooks
│   │   ├── useVoiceRecorder.ts   # Audio recording
│   │   └── useBiometric.ts       # Face ID / Touch ID
│   │
│   ├── utils/                    # Utility functions
│   │   └── format.ts             # Currency, date, number formatting
│   │
│   ├── constants/                # App constants
│   │   ├── config.ts             # API URL, timeouts
│   │   └── themes.ts             # 20 theme colors
│   │
│   └── types/                    # TypeScript types
│       └── index.ts              # Shared type definitions
│
└── assets/                       # Images, fonts, etc.
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator
- Backend API running on `http://localhost:3000`

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd fin-note-app

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env and set your API URL

# Start development server
npm start
```

### Running the App

```bash
# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run in web browser (limited features)
npm run web
```

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
EXPO_PUBLIC_API_TIMEOUT=30000
```

## 📱 Key Screens

### Dashboard
- Monthly summary cards (Income, Expense, Balance)
- Budget alerts
- Quick action buttons (Voice, Manual)
- Recent transactions (last 5)

### Add Transaction (Manual Entry)
- Money Note-style UI with large buttons
- Type selector (Expense/Income)
- Category grid (2 per row, 80px height)
- Calculator-style amount input
- Payment method chips
- Date quick selectors

### Voice Input
- Waveform visualizer (20 animated bars)
- Large record button with pulse animation
- 15-second auto-stop timer
- Transcript display
- Parsed data review with confidence score
- Edit before saving

### Transactions List
- Infinite scroll with pagination
- Grouped by date (Today, Yesterday, dates)
- Filter chips (All, Income, Expense)
- Pull to refresh
- Transaction cards with badges

### Reports
- Spending breakdown pie chart
  - Toggle between Category and Payment Method
- Monthly trend bar chart
  - Last 6 months comparison
  - Income vs Expense
- Current budgets with progress bars

### Settings
- Account information
- Theme color picker (20 colors)
- Notification preferences
- Voice settings
- Biometric authentication
- Logout

## 🎨 Design System

### Colors
- **Primary**: Blue (#4C6EF5) - customizable via theme selector
- **Success**: Green (#51CF66)
- **Danger**: Red (#FF6B6B)
- **Warning**: Yellow (#FCC419)

### Typography
- Font: System default (SF Pro on iOS, Roboto on Android)
- Sizes: xs (12px), sm (14px), base (16px), lg (18px), xl (20px), 2xl (24px), 3xl (30px), 4xl (36px)

### Components
All components built with NativeWind for consistent styling and easy customization.

## 🔐 Security

- JWT-based authentication with access + refresh tokens
- Tokens stored securely in Expo SecureStore (Keychain on iOS, KeyStore on Android)
- Auto token refresh on 401 responses
- Biometric authentication support
- Protected routes (redirect to login if not authenticated)

## 📊 State Management

### Zustand Slices
- **Auth**: User state, login/logout, token management
- **Voice**: Recording state, transcript, parsed expense data

### TanStack Query
- Server state caching (5-minute stale time)
- Automatic background refetching
- Optimistic updates
- Query invalidation on mutations

## 🎤 Voice Processing Flow

1. **Record**: User taps mic button, records up to 15 seconds
2. **Upload**: Audio file uploaded to backend
3. **Transcribe**: Whisper API converts speech to text
4. **Parse**: GPT-4 extracts amount, category, description
5. **Review**: User reviews parsed data (can edit)
6. **Save**: Transaction created with voice metadata

## 📈 Performance Optimizations

- Lazy loading with React.lazy (future)
- Memoized components with React.memo
- Optimized re-renders with proper dependency arrays
- Virtual scrolling for long lists (FlatList)
- Image optimization with Expo Image
- Bundle splitting with Expo Router

## 🧪 Testing

```bash
# Run tests (when implemented)
npm run test

# Run E2E tests with Detox (when implemented)
npm run test:e2e
```

## 🚢 Deployment

### Build for Production

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to stores
eas submit
```

### OTA Updates

```bash
# Publish update
eas update --branch production
```

## 📝 Development Checklist

### Completed ✅
- [x] Authentication (Login, Register, Biometric)
- [x] Dashboard with summary cards
- [x] Add Transaction (Manual Entry)
- [x] Transactions List (Infinite Scroll)
- [x] Voice Input with AI processing
- [x] Reports & Analytics (Charts)
- [x] Budget Management
- [x] Settings with theme customization
- [x] Pull to refresh
- [x] Protected routes
- [x] Token refresh

### Future Enhancements 🚀
- [ ] Edit/Delete transactions (swipe actions)
- [ ] Transaction detail modal
- [ ] Search transactions
- [ ] Export to CSV/PDF
- [ ] Push notifications
- [ ] Dark mode
- [ ] Recurring transactions
- [ ] Multiple currencies
- [ ] Categories management (CRUD)
- [ ] Tags support
- [ ] Attachments (receipts)

## 🤝 Contributing

This is a private project. For issues or suggestions, contact the team.

## 📄 License

Private - All rights reserved

## 🙏 Acknowledgments

- **Design Inspiration**: Money Note iOS app
- **AI Processing**: OpenAI Whisper + GPT-4
- **Framework**: Expo team for amazing developer experience
- **Built with**: Claude Code by Anthropic

---

**Version**: 1.0.0
**Last Updated**: February 2026
**Maintainer**: Development Team
