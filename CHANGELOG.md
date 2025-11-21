# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-11-21

### Initial Playable Release

This is the first playable release of the Factory Game, a client-side automation game that simulates a software development pipeline workflow.

#### Gameplay Features

**Pipeline Board System**
- Four-stage pipeline: Scheduled → In Development → In Review → Merged
- Visual representation of the software development lifecycle
- Real-time issue tracking with cycle counters
- Deterministic issue progression through pipeline stages
- Support for up to 50 concurrent issues to maintain performance
- Issues automatically advance after spending required cycles in each stage

**Game Mechanics**
- Manual cycle advancement to progress all issues by one cycle
- Auto-cycle mode for automated gameplay with configurable speed (500ms-3000ms per cycle)
- Issue spawning system with maximum concurrent limit enforcement
- Throughput metrics tracking efficiency as processed issues per cycle
- Credits system: earn 10 credits per completed issue

**HUD Dashboard**
- Real-time display of current cycle count
- Total processed issues counter
- Throughput efficiency score
- Credits balance tracking
- Active upgrade effects indicator

**Upgrades System**
- Faster Development upgrade: reduces development time from 2 to 1 cycle (costs 50 credits)
- Purchase upgrades with earned credits
- Immediate application of upgrade effects to cycle timing
- Prevention of purchases when credits are insufficient

**Settings & Customization**
- Adjustable auto-cycle speed slider (500ms to 3000ms)
- Animation toggle for performance optimization
- Comprehensive tutorial/help system with game instructions
- Reset game functionality with confirmation dialog

#### Persistence

**LocalStorage Integration**
- All game state automatically saved to browser localStorage
- Progress persists across browser sessions
- Graceful fallback to in-memory state when localStorage unavailable (private browsing mode)
- Schema migration support for handling future updates
- Safe handling of missing or extra fields during state restoration

**Persisted State Includes:**
- Current cycle count
- Total processed issues
- Credits balance
- Active upgrades and their effects
- All issues in pipeline with their current stage and cycle count
- Auto-cycle state and speed settings
- Animation preferences

#### Testing Coverage

**Comprehensive Test Suite (75 tests across 9 test files)**
- App.test.tsx (10 tests): Game controls, issue spawning, cycle advancement
- persistence.test.ts (20 tests): LocalStorage integration, schema migration, fallback behavior
- edgeCases.test.tsx (8 tests): Rapid state changes, concurrent operations, issue limit enforcement
- Settings.test.tsx (9 tests): Settings UI, reset functionality, speed adjustments
- Upgrades.test.tsx (8 tests): Purchase validation, credit deduction, upgrade effects
- HUD.test.tsx (8 tests): Real-time display updates, metrics calculations
- StageColumn.test.tsx (5 tests): Pipeline stage rendering, issue display
- PipelineBoard.test.tsx (3 tests): Board layout, stage organization
- IssueToken.test.tsx (4 tests): Issue token rendering, cycle display

**Testing Technologies:**
- Vitest as test runner
- React Testing Library for component testing
- jest-dom for DOM assertions
- Comprehensive coverage of user interactions and edge cases

#### Technical Stack

- **Vite** - Fast build tool and development server
- **React 19** - UI library with hooks-based state management
- **TypeScript** - Full type safety across entire codebase
- **Tailwind CSS v4** - Utility-first CSS framework with automatic purging
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing utilities
- **ESLint** - Code linting with strict configuration

#### Developer Experience

- Hot module replacement in development mode
- TypeScript configuration with strict type checking
- ESLint code quality checks
- Optimized production builds with code splitting
- Zero-configuration Tailwind CSS with automatic unused style purging
- Comprehensive test coverage with watch mode support

#### Edge Cases Handled

- npm install works on clean machine with locked dependencies (package-lock.json)
- Tailwind purges unused CSS to keep bundle small
- Base HTML includes viewport meta tag for mobile responsiveness
- Maximum 50 concurrent issues enforced to prevent performance degradation
- Zero issues state handled gracefully across all pipeline stages
- Issue ordering remains stable during concurrent spawning and cycle advancement
- Auto-cycle cleanup prevents memory leaks on component unmount
- Merged issues visible for one cycle before removal to show completion
- LocalStorage unavailable (private mode) gracefully falls back to in-memory state
- Persistence schema migrations handle missing/extra fields safely
- Upgrade purchases prevented when credits are insufficient
- Credits properly awarded on issue completion
- Upgrade effects applied immediately to cycle timing

#### Deployment

- **Serverless**: All game logic runs in browser, no backend required
- **Static hosting ready**: Can be deployed to Netlify, Vercel, GitHub Pages, or any static host
- **No routing**: Single page application without client-side routing
- **No server APIs**: All data managed locally in browser
- **Optimized bundles**: Production build creates minimal, compressed assets

---

[0.1.0]: https://github.com/AgentFoundryTest/af-factory-game/releases/tag/v0.1.0
