# DevTinder

DevTinder is a developer-centric matchmaking platform where users can discover other developers, send connection requests, and communicate through real-time one-to-one messaging.

The backend is built with **Node.js**, **Express**, **MongoDB**, **Mongoose**, and **Socket.IO**. While the project was initially inspired by  [Akshay Saini's Namaste Node.js course.](https://namastedev.com/learn/namaste-node)

---
## 📖 Why I Built DevTinder?

I built DevTinder to move beyond basic CRUD applications and gain hands-on experience building a production-oriented backend. Through this project, I explored authentication, authorization, user relationships, RESTful API design, database modeling, and real-time one-to-one messaging using Socket.IO while focusing on writing scalable, maintainable, and readable backend code. Although it began as part of my backend learning journey, I continued extending it independently by designing new features, making architectural decisions, and implementing functionality.

---

## 🛠️ Tech Stack

* **Node.js** — Runtime environment
* **Express.js** — Web framework
* **MongoDB + Mongoose** — Database & ODM
* **Socket.IO** — Real-time bidirectional communication
* **JWT** — Authentication
* **bcrypt** — Password hashing
* **Cookie Parser** — Cookie handling
* **Validator.js** — Input validation
* **dotenv** — Environment configuration
* **Nodemon** *(Development)* — Automatic server restart

---

## ✨ Features

* User authentication (Signup, Login, Logout)
* JWT-based authentication and authorization
* User profile management
* Developer feed
* Send, review, and remove connection requests
* View accepted connections
* One-to-one real-time chat using Socket.IO
* Persistent chat history
* Chat list with latest message preview
* REST APIs for chat history and user conversations
* MongoDB-backed message persistence

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/devtinder.git
cd devtinder
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file and add the required environment variables.

```bash
PORT=2006

MONGO_URI=

JWT_SECRET=
```
### 4. Run the development server

```bash
npm run dev
```

The server will start at:

```text
http://localhost:3000
```

---

## 📁 API Documentation

Complete API reference is available in:

👉 [apiList.md](./apiList.md)
