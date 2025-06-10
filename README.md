# Wishlist Tracker App

A cross-platform mobile application for tracking and managing wishlists with automatic link parsing and price monitoring.

## Overview

The Wishlist Tracker App allows users to:
- Create and manage multiple wishlists
- Add products via URL with automatic metadata extraction
- Track price changes over time
- Share wishlists with friends and family
- Receive notifications for price drops
- Organize items by categories and priorities

## Tech Stack

### Frontend
- **React Native + Expo**: Cross-platform development with easy deployment
- **UI Library**: React Native Elements for consistent design system
- **State Management**: Zustand (lightweight and simple)
- **Navigation**: React Navigation v6
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth
- **File Storage**: AWS S3 for product images
- **Link Parsing**: 
  - Puppeteer for web scraping
  - Open Graph parser as fallback
  - External APIs (LinkPreview.net, Microlink.io)

### Infrastructure
- **Backend Hosting**: Railway/Render/Vercel
- **Database**: Supabase (PostgreSQL + Auth)
- **Image Storage**: AWS S3 or Cloudinary

## Project Structure

```
wishlist-app/
├── src/                    # Mobile app source code
│   ├── components/         # Reusable UI components
│   │   ├── common/        # Shared components (buttons, inputs, etc.)
│   │   ├── wishlist/      # Wishlist-specific components
│   │   ├── product/       # Product-related components
│   │   └── auth/          # Authentication components
│   ├── screens/           # App screens
│   │   ├── auth/          # Login, Register, etc.
│   │   ├── main/          # Home, Dashboard
│   │   ├── wishlist/      # Wishlist views
│   │   └── settings/      # User settings
│   ├── services/          # API and external services
│   │   ├── api/           # API client and endpoints
│   │   ├── auth/          # Authentication service
│   │   └── link-parser/   # URL parsing service
│   ├── navigation/        # Navigation configuration
│   ├── store/            # Zustand state management
│   ├── utils/            # Helper functions
│   ├── types/            # TypeScript type definitions
│   ├── constants/        # App constants
│   └── hooks/            # Custom React hooks
├── backend/              # Node.js backend
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Route controllers
│   │   ├── services/     # Business logic
│   │   ├── middleware/   # Express middleware
│   │   └── utils/        # Backend utilities
│   └── prisma/           # Database schema and migrations
└── assets/               # Images, fonts, etc.
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- PostgreSQL database
- AWS/Cloudinary account (for image storage)
- Supabase account

### Frontend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd wishlist-app
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the root directory:
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm start
# or
expo start
```

5. Run on simulator/device:
- iOS: Press `i` in the terminal
- Android: Press `a` in the terminal
- Or scan the QR code with Expo Go app

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the backend directory:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/wishlist_db
JWT_SECRET=your_jwt_secret
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_BUCKET_NAME=your_bucket_name
PORT=3000
```

4. Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
```

5. Start the backend server:
```bash
npm run dev
```

## Development

### Running Tests
```bash
# Frontend tests
npm test

# Backend tests
cd backend && npm test
```

### Building for Production

#### Mobile App
```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android

# EAS Build (recommended)
eas build --platform all
```

#### Backend
```bash
cd backend
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.