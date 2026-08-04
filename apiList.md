# 📚 API Reference – DevTinder Backend

This document lists all available API endpoints for the DevTinder backend.

---

## 🔐 Authentication Routes

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST | /api/signup | Register a new user |
| POST | /api/login | Authenticate user |
| POST | /api/logout | Logout the current user |

---

## 👤 Profile Routes

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | /api/profile/view | Get logged-in user's profile |
| PATCH | /api/profile/edit | Update profile information |
| PATCH | /api/profile/password | Change account password |
| PATCH | /api/profile/remove/skill | Remove a skill from profile |

---

## 🤝 Connection Request Routes

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST | /api/request/send/:status/:userId | Send a connection request |
| POST | /api/request/review/:status/:requestId | Review a received connection request |
| DELETE | /api/request/connection/:userId | Remove an existing connection |

**Supported request statuses:**

- `interested`
- `ignored`
- `accepted`
- `rejected`

---

## 👥 User Routes

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | /api/user/feed | Get user feed |
| GET | /api/user/connections | Get logged-in user's connections |
| GET | /api/user/requests/received | Get received connection requests |

---

## 💬 Chat Routes

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | /api/chats | Get all chats of the logged-in user |
| GET | /api/chats/:chatId/messages | Get message history for a chat |

---

## ⚡ Socket.IO Events

### Client → Server

| Event | Description |
| ----- | ----------- |
| `joinChat` | Join a private chat room |
| `sendMessage` | Send a message to the current chat |

### Server → Client

| Event | Description |
| ----- | ----------- |
| `messageReceived` | Receive a new message |
| `joinChatError` | Failed to join chat |
| `sendMessageError` | Failed to send message | 