# GoodDollar Login Example

This project demonstrates how to implement login with GoodDollar using the GoodDollar client-sdk. It features two different UI templates for the login interface.

## Live Demo

Visit [https://good-dollar.netlify.app/](https://good-dollar.netlify.app/)

## Features

- Two login UI templates:
  - Modern: Clean, minimalist design
  - Slide: Blue-themed interface with slide animations
- Display user information after successful login:
  - Full Name
  - Wallet Address
  - Mobile Number
  - Location
  - Email
- Easy template switching with toggle button

## Known Browser Behaviors

There are some browser-specific behaviors to be aware of:

- **Brave Browser**: Login process remains within the application, allowing users to see their profile information after authentication
- **Chrome**: Redirects to the GoodDollar wallet and remains there. Users will need to manually navigate back to the application

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

## Configuration

The application uses a configuration file (`src/config.js`) that includes:

- Production environment settings
- Web URLs
- Contract IDs
- Redirect links

## Dependencies

Main dependencies include:

- React 17.0.2
- @gooddollar/goodlogin-sdk: 1.1.15
- client-sdk-gooddollar: 1.0.20
- Other React-related dependencies

## Available Scripts

- `npm start` or `yarn start`: Runs the app in development mode
- `npm build` or `yarn build`: Builds the app for production
- `npm test` or `yarn test`: Runs the test suite
- `npm eject` or `yarn eject`: Ejects from Create React App

## Contributing

Feel free to submit issues and enhancement requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
