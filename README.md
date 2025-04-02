# GoodDollar Login Example

This project demonstrates how to implement login with GoodDollar using the GoodDollar client-sdk.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd gooddollarLoginExample
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm start
# or
yarn start
```

The app will open in your default browser at `http://localhost:3000`.

## Features

- Login with GoodDollar (DEV, PROD, and STAGING environments)
- Display user information after successful login:
  - Full Name
  - Wallet Address
  - Mobile Number
  - Location
  - Email

## Environment Configuration

The app includes three different GoodDollar login configurations:

- Development (DEV)
- Production (PROD)
- Staging (STAGING)

Each environment uses different redirect links and contract IDs.

## Dependencies

- React
- @gooddollar/goodlogin-sdk
- client-sdk-gooddollar
- Other React-related dependencies

## Available Scripts

- `npm start` or `yarn start`: Runs the app in development mode
- `npm build` or `yarn build`: Builds the app for production
- `npm test` or `yarn test`: Runs the test suite
- `npm eject` or `yarn eject`: Ejects from Create React App
