const express = require("express");
const jwt = require("jsonwebtoken");
const auth_users = express.Router();

const SECRET_KEY = "mysecretkey"; // You can change this

// --------------------------------------------------------------------
// 🔗 Import shared books & users data from general.js
// (In your actual IBM lab they’re shared through a common module.
// Here we’ll mock them directly to make it self-contained.)
// --------------------------------------------------------------------
let books = {
  1: { title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "9780743273565", reviews: {} },
  2: { title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "9780060935467", reviews: {} },
  3: { title: "1984", author: "George Orwell", isbn: "9780451524935", reviews: {} },
  4: { title: "Pride and Prejudice", author: "Jane Austen", isbn: "9781503290563", reviews: {} }
};

// Mock user store
let users = [
  { username: "john", password: "12345" },
  { username: "emma", password: "67890" }
];

// --------------------------------------------------------------------
// 🧠 TASK 7: Customer login (POST /customer/login)
// --------------------------------------------------------------------
auth_users.post("/customer/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username/password provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Verify user credentials
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  // Generate JWT token
  const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: "1h" });

  return res.status(200).json({ message: "Login successful", token });
});

// --------------------------------------------------------------------
// Middleware to verify JWT for protected routes
// --------------------------------------------------------------------
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token missing" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
}

// --------------------------------------------------------------------
// 🧠 TASK 8: Add or modify book review (PUT /auth/review/:isbn)
// --------------------------------------------------------------------
auth_users.put("/auth/review/:isbn", authenticateToken, (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review; // review text passed as query
  const username = req.user.username;

  // Validate
  if (!books || Object.keys(books).length === 0) {
    return res.status(500).json({ message: "Book list not found." });
  }

  let foundBook = null;
  for (let key in books) {
    if (books[key].isbn === isbn) {
      foundBook = books[key];
      break;
    }
  }

  if (!foundBook) {
    return res.status(404).json({ message: "Book not found with this ISBN." });
  }

  if (!review) {
    return res.status(400).json({ message: "Review text is required as a query parameter." });
  }

  // Add or modify review
  foundBook.reviews[username] = review;

  return res.status(200).json({
    message: `Review added/updated successfully by ${username}`,
    reviews: foundBook.reviews
  });
});

// --------------------------------------------------------------------
// 🧠 TASK 9: Delete book review (DELETE /auth/review/:isbn)
// --------------------------------------------------------------------
auth_users.delete("/auth/review/:isbn", authenticateToken, (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  let foundBook = null;
  for (let key in books) {
    if (books[key].isbn === isbn) {
      foundBook = books[key];
      break;
    }
  }

  if (!foundBook) {
    return res.status(404).json({ message: "Book not found with this ISBN." });
  }

  if (foundBook.reviews[username]) {
    delete foundBook.reviews[username];
    return res.status(200).json({
      message: `Review by ${username} deleted successfully.`,
      reviews: foundBook.reviews
    });
  } else {
    return res.status(404).json({ message: "No review found for this user." });
  }
});

module.exports = auth_users;
