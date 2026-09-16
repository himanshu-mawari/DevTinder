# DevTinder — Backend

REST and real-time API for DevTinder, a developer-matching platform with live chat and connection requests.

## Features

- JWT-based authentication with httpOnly cookies
- Developer discovery feed with page-based pagination
- Connection requests with real-time request and acceptance events
- One-to-one real-time messaging with cursor-based message history pagination
- Per-user read tracking for chat messages
- Real-time communication via Socket.IO

## Tech Stack

- Node.js
- Express.js
- MongoDB / Mongoose
- Socket.IO
- JWT
- bcrypt

## Architecture

```text
Client → Express API → Middleware → Controllers → Mongoose → MongoDB
```

```text
Client ↔ Socket.IO → Socket Handlers → Mongoose → MongoDB
```

## Authentication

```text
Login → Validate credentials → Generate JWT → Set httpOnly cookie
Protected request → Auth middleware → Verify JWT → Attach user
```

## API Documentation

Detailed API endpoints and Socket.IO events are documented in the [API Reference](./apiList.md).

## Database

### Chat

```text
Chat
├── roomId
├── participants
├── lastMessage
├── lastMessageAt
└── lastReadBy    // { userId: timestamp }
```

### Message

```text
Message
├── senderId
├── chatId
├── text
└── createdAt
```

## Real-Time Communication

- Authenticated sockets join a personal room (`user:<id>`) for real-time connection request events.
- The active conversation uses a screen-scoped room for live message delivery.
- Read state is tracked per participant using atomic MongoDB `$set` updates on `lastReadBy`.

## Environment Variables

```env
PORT=3000
MONGODB_URI=<mongodb-url>
JWT_SECRET=<jwt-secret>
CLOUD_NAME=<cloud-name>
CLOUD_API_KEY=<api-key>
CLOUD_API_SECRET=<api-secret>
NODE_ENV=development
FRONTEND_URL:http://localhost:5173
```

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

```bash
git clone https://github.com/himanshu-mawari/Devtinder.git
cd Devtinder
npm install
```

## Running Locally

Development (with nodemon, auto-restart on changes):

```bash
npm run dev
```

Production:

```bash
npm start
```

## Related Repository

Frontend: [DevTinder — Frontend](https://github.com/himanshu-mawari/devtinder-frontend)

## Deployment

Live API: https://devtinder-himanshu-api.onrender.com
