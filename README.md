# Factory Game

A client-side automation game built with Vite + React + TypeScript + Tailwind CSS. This is a serverless web game where all logic runs in the browser.

![Factory Game UI](https://github.com/user-attachments/assets/01359dc9-8f31-48cc-b8f6-43def370152c)

## Project Structure

```
.
├── web/                      # Main SPA application
│   ├── src/                  # Source code
│   │   ├── App.tsx           # Main application component
│   │   ├── main.tsx          # Application entry point
│   │   └── test/             # Test setup files
│   ├── public/               # Static assets
│   ├── dist/                 # Production build output (generated)
│   ├── package.json          # NPM dependencies and scripts
│   ├── vite.config.ts        # Vite configuration
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   ├── postcss.config.js     # PostCSS configuration
│   ├── tsconfig.json         # TypeScript configuration (root)
│   ├── tsconfig.app.json     # TypeScript app configuration
│   └── tsconfig.node.json    # TypeScript node configuration
├── README.md                 # This file
└── LICENSE                   # GPLv3 license
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

- **Interactive Pipeline Board**: Visual representation of the software development lifecycle
  - Four stages: Scheduled → In Development → In Review → Merged
  - Real-time issue tracking with cycle counters
  - Deterministic issue progression through pipeline stages
- **Game Mechanics**:
  - Spawn issues into the pipeline (maximum 50 concurrent issues)
  - Manual cycle advancement to progress issues through stages
  - Auto-cycle mode for automated gameplay (1 cycle per second)
  - Throughput metrics showing issues processed per cycle
- **Responsive Design**: Optimized for various screen sizes with dark theme UI
- **HUD Dashboard**: Real-time display of current cycle, processed issues, and throughput
- **Client-Side Logic**: All game state managed in browser with React hooks
- **Type-Safe**: Full TypeScript implementation with comprehensive type definitions
- **Tested**: Complete test suite with React Testing Library (22 tests)
- **Developer Experience**:
  - Tailwind CSS configured with automatic purging for optimal bundle size
  - Vitest test suite with React Testing Library
  - ESLint configuration for code quality

## Game Mechanics

The pipeline simulates a software development workflow where issues progress through stages:

1. **Scheduled** (1 cycle) → Issues wait to be picked up
2. **In Development** (2 cycles) → Active development work
3. **In Review** (1 cycle) → Code review and QA
4. **Merged** (1 cycle) → Completed and visible before removal

Issues automatically advance after spending the required cycles in each stage. Players can:
- **Spawn Issue**: Create new work items (max 50 concurrent)
- **Advance Cycle**: Manually progress all issues by one cycle
- **Auto-Cycle**: Enable automatic progression every second

**Throughput** measures efficiency as: `Total Processed Issues / Total Cycles`

## Edge Cases Handled

- ✅ `npm install` works on clean machine with locked dependencies (package-lock.json)
- ✅ Tailwind purges unused CSS to keep bundle small (configured in tailwind.config.js)
- ✅ Base HTML includes viewport meta tag for mobile responsiveness
- ✅ Maximum 50 concurrent issues enforced to prevent performance degradation
- ✅ Zero issues state handled gracefully across all pipeline stages
- ✅ Issue ordering remains stable during concurrent spawning and cycle advancement
- ✅ Auto-cycle cleanup prevents memory leaks on component unmount
- ✅ Merged issues visible for one cycle before removal to show completion

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
