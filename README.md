# Factory Game

A client-side automation game built with Vite + React + TypeScript + Tailwind CSS. This is a serverless web game where all logic runs in the browser.

![Factory Game UI](https://github.com/user-attachments/assets/01359dc9-8f31-48cc-b8f6-43def370152c)

## Project Structure

```
.
├── web/               # Main SPA application
│   ├── src/          # Source code
│   │   ├── App.tsx   # Main application component
│   │   ├── main.tsx  # Application entry point
│   │   └── test/     # Test setup files
│   ├── public/       # Static assets
│   └── dist/         # Production build output (generated)
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```

## Prerequisites

- Node.js (version 18 or higher recommended)
- npm or yarn

## Installation

Clone the repository and install dependencies:

```bash
cd web
npm install
```

## Development

### Start Development Server

Run the development server with hot module replacement:

```bash
cd web
npm run dev
```

The application will be available at `http://localhost:5173/`

### Build for Production

Create an optimized production build:

```bash
cd web
npm run build
```

The static files will be output to `web/dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
cd web
npm run preview
```

### Run Tests

Execute the test suite:

```bash
cd web
npm test
```

For watch mode during development:

```bash
cd web
npm test -- --watch
```

### Lint Code

Run ESLint to check code quality:

```bash
cd web
npm run lint
```

## Technology Stack

- **Vite** - Fast build tool and dev server
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS v4** - Utility-first CSS framework
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing utilities
- **ESLint** - Code linting

## Project Constraints

- **Client-side only**: All game logic runs in the browser, no backend required
- **No routing**: Single page application without client-side routing
- **No server APIs**: All data is managed locally in the browser
- **Static deployment**: Can be deployed to any static hosting service (Netlify, Vercel, GitHub Pages, etc.)

## Features

- Responsive design optimized for various screen sizes
- Dark theme UI using Tailwind CSS
- Base layout with:
  - HUD header showing resources and production rates
  - Production pipeline area (placeholder)
  - Available machines sidebar
- Tailwind CSS configured with automatic purging for optimal bundle size
- TypeScript for type safety
- Vitest test suite with React Testing Library
- ESLint configuration for code quality

## Edge Cases Handled

- ✅ `npm install` works on clean machine with locked dependencies (package-lock.json)
- ✅ Tailwind purges unused CSS to keep bundle small (configured in tailwind.config.js)
- ✅ Base HTML includes viewport meta tag for mobile responsiveness

## Contributing

When adding new features:
1. Write tests for new components
2. Run `npm run lint` to check code style
3. Run `npm test` to ensure all tests pass
4. Run `npm run build` to verify production build works

# Permanents (License, Contributing, Author)

Do not change any of the below sections

## License

All Agent Foundry work is licensed under the GPLv3 License - see the LICENSE file for details.

## Contributing

Feel free to submit issues and enhancement requests!

## Author

Created by Agent Foundry and John Brosnihan
