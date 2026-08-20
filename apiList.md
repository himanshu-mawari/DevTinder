# 📚 API Reference – DevTinder Backend

This document lists all available API endpoints for the DevTinder backend.

---

## 🔐 Authentication Routes

| Method | Endpoint | Description             |
| ------ | -------- | ----------------------- |
| POST   | /signup  | Register a new user     |
| POST   | /login   | Authenticate user       |
| POST   | /logout  | Logout the current user |

---

## 👤 Profile Routes

| Method | Endpoint              | Description                  |
| ------ | --------------------- | ---------------------------- |
| GET    | /profile/view         | Get logged-in user's profile |
| PATCH  | /profile/edit         | Update profile information   |
| PATCH  | /profile/password     | Change account password      |
| PATCH  | /profile/remove/skill | Remove a skill from profile  |

---

## 🤝 Connection Request Routes

| Method | Endpoint                           | Description                          |
| ------ | ---------------------------------- | ------------------------------------ |
| POST   | /request/send/:status/:userId      | Send a connection request            |
| POST   | /request/review/:status/:requestId | Review a received connection request |
| DELETE | /request/connection/:userId        | Remove an existing connection        |

**Supported request statuses:**

- `interested`
- `ignored`
- `accepted`
- `rejected`

---

## 👥 User Routes

| Method | Endpoint                | Description                      |
| ------ | ----------------------- | -------------------------------- |
| GET    | /user/feed              | Get user feed                    |
| GET    | /user/connections       | Get logged-in user's connections |
| GET    | /user/requests/received | Get received connection requests |
| GET    | /user/:userId           | Get other user detail            |

---

## 💬 Chat Routes

| Method | Endpoint                | Description                         |
| ------ | ----------------------- | ----------------------------------- |
| GET    | /chats                  | Get all chats of the logged-in user |
| GET    | /chats/:chatId/messages | Get message history for a chat      |

---

## ⚡ Socket.IO Events

### Client → Server

| Event         | Description                        |
| ------------- | ---------------------------------- |
| `joinChat`    | Join a private chat room           |
| `sendMessage` | Send a message to the current chat |

### Server → Client

| Event              | Description            |
| ------------------ | ---------------------- |
| `messageReceived`  | Receive a new message  |
| `joinChatError`    | Failed to join chat    |
| `sendMessageError` | Failed to send message |
