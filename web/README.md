# Factory Game - Web Application

A client-side automation game built with Vite + React + TypeScript + Tailwind CSS. This is the main web application for the Factory Game project.

## About

This is a serverless, single-page application (SPA) where all game logic runs in the browser. The game features a production pipeline system where players can build and manage automated factories.

## Prerequisites

- Node.js (version 18 or higher recommended)
- npm or yarn

## Installation

Install dependencies:

```bash
npm install
```

## Development

### Start Development Server

Run the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Build for Production

Create an optimized production build with TypeScript type checking:

```bash
npm run build
```

The static files will be output to the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Run Tests

Execute the test suite:

```bash
npm test
```

For watch mode during development:

```bash
npm test -- --watch
```

### Lint Code

Run ESLint to check code quality:

```bash
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
- **Static deployment**: Can be deployed to any static hosting service

## Current Features

- Responsive dark theme UI
- HUD header showing resources and production rates
- Production pipeline area (placeholder for drag-and-drop functionality)
- Available machines sidebar (Collector, Processor, Assembler)
- Tailwind CSS with automatic purging for optimal bundle size
- Full TypeScript type checking
- Comprehensive test suite

## Contributing

When adding new features:

1. Write tests for new components
2. Run `npm run lint` to check code style
3. Run `npm test` to ensure all tests pass
4. Run `npm run build` to verify production build works

## License

This project is licensed under the GPLv3 License - see the LICENSE file in the repository root for details.

