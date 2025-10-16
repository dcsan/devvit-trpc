# Devvit tRPC Counter

An interactive collaborative counter application built with tRPC and React that demonstrates full end-to-end type safety on the Reddit platform. This app showcases modern web development practices within Reddit's Devvit ecosystem, featuring the iconic Reddit mascot Snoo, a clean mobile-first interface, and powerful admin capabilities.

## What This Game Is and Does

This is a **collaborative counting game** that runs directly within Reddit posts. It's a shared digital counter where every Reddit user can contribute by incrementing or decrementing a global count that persists across all sessions. The game features:

- **Global Shared Counter**: One counter shared by all users across Reddit
- **Real-time Updates**: Changes are instantly visible with optimistic UI updates
- **Persistent State**: All changes are saved permanently using Redis database
- **Personalized Experience**: Greets users with their Reddit username
- **Clean Interface**: Features Reddit's beloved Snoo mascot and intuitive design
- **Admin Panel**: Comprehensive admin interface for managing and monitoring the counter
- **Debug Tools**: Built-in debugging and monitoring capabilities for developers

## What Makes This Game Innovative

- **Full Type Safety**: Complete end-to-end type safety from client to server using tRPC v11, eliminating runtime API errors
- **Optimistic Updates**: UI responds instantly to clicks while syncing with the server in the background for smooth gameplay
- **Zero-Config Reddit Integration**: Runs natively within Reddit posts with automatic user authentication and context
- **Collaborative Social Experiment**: Creates a unique shared experience where every Reddit user contributes to the same global state
- **Mobile-First Design**: Responsive interface with large touch-friendly buttons optimized for mobile Reddit users
- **Zero API Boilerplate**: tRPC eliminates manual API type definitions and provides automatic client generation
- **Smart Caching**: Session-based version info caching to minimize API calls and improve performance
- **Bulletproof Error Recovery**: Built-in retry mechanisms, graceful error handling, and rollback on failures
- **Developer Experience**: Showcases modern full-stack TypeScript development with hot reloading and type inference
- **Advanced Admin Tools**: Real-time monitoring, counter reset capabilities, and comprehensive debug information
- **Modular Architecture**: Clean separation between user interface and admin functionality with client-side routing

## How to Play

### Getting Started
1. **Launch the App**: Click the "Launch App" button when you see the counter post in your Reddit feed
2. **Meet Snoo**: You'll be greeted by Reddit's mascot Snoo and a personalized welcome message showing "Hey [YourUsername] 👋"
3. **See the Current Count**: The global counter value is displayed prominently in large text between two red circular buttons

### Playing the Game
4. **Increment the Counter**: Click the red "+" button on the right to increase the global counter by 1
5. **Decrement the Counter**: Click the red "-" button on the left to decrease the global counter by 1
6. **Watch Instant Updates**: Your clicks are immediately reflected in the UI, even before the server confirms the change
7. **Loading Feedback**: Notice the "..." indicator when the app is processing your request in the background

### Game Mechanics
- **Collaborative Experience**: The counter is shared globally - all Reddit users see and contribute to the same count
- **Persistent Progress**: Your changes are saved permanently using Redis, so the count persists across all sessions and users
- **No Limits**: You can click as many times as you want - there are no restrictions on how much you can contribute
- **Real-time Sync**: If multiple users are playing simultaneously, you'll see their changes update in real-time

### Admin Features (For Moderators/Developers)
8. **Access Admin Panel**: Navigate to the admin interface to view detailed statistics and controls
9. **Monitor Stats**: View current counter value, active user, post ID, and app version information
10. **Reset Counter**: Use the admin panel to reset the global counter back to 0 (requires confirmation)
11. **Refresh Data**: Manually refresh all data to ensure you're seeing the latest information
12. **Debug Information**: Access comprehensive debug data including timestamps and system state

### Special Features
- **Personalized Greeting**: The app displays your Reddit username when you're logged in
- **Optimistic UI**: Buttons respond instantly to clicks for a smooth, game-like experience
- **Visual Loading States**: Clear feedback shows when operations are in progress
- **Version Information**: Footer displays current app version and build information
- **Error Recovery**: If something goes wrong, you can retry operations with built-in error handling
- **Mobile Optimized**: Large, touch-friendly buttons perfect for mobile Reddit browsing
- **Admin Interface**: Comprehensive management tools with real-time statistics and control options
- **Debug Mode**: Detailed system information for troubleshooting and monitoring

**The Goal**: There's no winning or losing - this is a collaborative social experiment where every Reddit user contributes to building a shared global count together. It's a simple but engaging way to participate in a community-driven activity that demonstrates the power of collective action in digital spaces. The admin panel adds a layer of management and monitoring capabilities for moderators and developers.

## Technology Stack

- [Devvit](https://developers.reddit.com/): Reddit's developer platform for building interactive apps
- [React](https://react.dev/): Frontend UI framework
- [tRPC](https://trpc.io/): End-to-end typesafe APIs
- [Express](https://expressjs.com/): Backend server framework
- [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/): Type-safe JavaScript
- [Vite](https://vite.dev/): Fast build tool and development server


## Getting Started (For Developers)

> Make sure you have Node 22 downloaded on your machine before running!

### Prerequisites
- Node.js 22.2.0 or higher
- Reddit account connected to Reddit Developers
- Devvit CLI installed

### Installation

1. Clone this repository
2. Install dependencies: `npm install`
3. Set up your Reddit developer account at [developers.reddit.com](https://developers.reddit.com)
4. Login to Devvit: `npm run login`

## Development Commands

- `npm run dev`: Starts a development server where you can develop your application live on Reddit
- `npm run build`: Builds your client and server projects
- `npm run deploy`: Uploads a new version of your app to Reddit
- `npm run launch`: Publishes your app for review and public use
- `npm run login`: Logs your CLI into Reddit
- `npm run check`: Type checks, lints, and prettifies your app

## Architecture Highlights

### tRPC Integration
This project showcases a complete tRPC integration with:
- **Type-safe API calls**: No manual type definitions needed
- **Optimistic updates**: UI responds instantly while syncing with server
- **Automatic error handling**: Built-in error boundaries and retry logic
- **React Query integration**: Efficient caching and state management

### Devvit Platform Features
- **Redis persistence**: Counter state survives app restarts
- **Reddit user integration**: Automatic user authentication and context
- **Serverless architecture**: Scales automatically with Reddit's infrastructure
- **Mobile-responsive design**: Works seamlessly on desktop and mobile

## Project Structure

```
src/
├── client/          # React frontend
│   ├── App.tsx      # Main game component
│   ├── hooks/       # tRPC-powered React hooks
│   └── trpc/        # tRPC client configuration
├── server/          # Express backend
│   ├── index.ts     # Server setup with tRPC integration
│   └── trpc/        # tRPC router and procedures
└── shared/          # Shared types (auto-generated by tRPC)
```

