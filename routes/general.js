const express = require("express");
const axios = require("axios");
let general = express.Router();

// Mock data (same as before)
let books = {
  1: { title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "9780743273565" },
  2: { title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "9780060935467" },
  3: { title: "1984", author: "George Orwell", isbn: "9780451524935" },
  4: { title: "Pride and Prejudice", author: "Jane Austen", isbn: "9781503290563" }
};

// =====================================================================
// 🧠 TASK 10: Get all books (Async/Await + Promise)
// =====================================================================

// ✅ Using Promise callbacks
general.get("/async/books-promise", (req, res) => {
  new Promise((resolve, reject) => {
    if (books) resolve(books);
    else reject("No books found!");
  })
    .then((result) => {
      res.send(JSON.stringify(result, null, 4));
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

// ✅ Using Async/Await (recommended)
general.get("/async/books", async (req, res) => {
  try {
    // Simulating fetching data via Axios (self-call)
    const response = await axios.get("http://localhost:5000/booksdata");
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Helper route to serve local book data for Axios to call internally
general.get("/booksdata", (req, res) => {
  res.json(books);
});

// =====================================================================
// 🧠 TASK 11: Get book details by ISBN (Async/Await + Promise)
// =====================================================================

// ✅ Using Promise callbacks
general.get("/async/isbn-promise/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    const book = Object.values(books).find((b) => b.isbn === isbn);
    if (book) resolve(book);
    else reject("Book not found with given ISBN.");
  })
    .then((result) => res.send(JSON.stringify(result, null, 4)))
    .catch((err) => res.status(404).json({ message: err }));
});

// ✅ Using Async/Await
general.get("/async/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get("http://localhost:5000/booksdata");
    const book = Object.values(response.data).find((b) => b.isbn === isbn);

    if (book) res.send(JSON.stringify(book, null, 4));
    else res.status(404).json({ message: "Book not found with given ISBN." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =====================================================================
// 🧠 TASK 12: Get books by Author (Async/Await + Promise)
// =====================================================================

// ✅ Using Promise callbacks
general.get("/async/author-promise/:author", (req, res) => {
  const author = req.params.author.toLowerCase();
  new Promise((resolve, reject) => {
    const filtered = Object.values(books).filter(
      (b) => b.author.toLowerCase() === author
    );
    if (filtered.length > 0) resolve(filtered);
    else reject("No books found for this author.");
  })
    .then((result) => res.send(JSON.stringify(result, null, 4)))
    .catch((err) => res.status(404).json({ message: err }));
});

// ✅ Using Async/Await
general.get("/async/author/:author", async (req, res) => {
  const author = req.params.author.toLowerCase();
  try {
    const response = await axios.get("http://localhost:5000/booksdata");
    const filtered = Object.values(response.data).filter(
      (b) => b.author.toLowerCase() === author
    );

    if (filtered.length > 0) res.send(JSON.stringify(filtered, null, 4));
    else res.status(404).json({ message: "No books found for this author." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =====================================================================
// 🧠 TASK 13: Get books by Title (Async/Await + Promise)
// =====================================================================

// ✅ Using Promise callbacks
general.get("/async/title-promise/:title", (req, res) => {
  const title = req.params.title.toLowerCase();
  new Promise((resolve, reject) => {
    const filtered = Object.values(books).filter(
      (b) => b.title.toLowerCase() === title
    );
    if (filtered.length > 0) resolve(filtered);
    else reject("No books found for this title.");
  })
    .then((result) => res.send(JSON.stringify(result, null, 4)))
    .catch((err) => res.status(404).json({ message: err }));
});

// ✅ Using Async/Await
general.get("/async/title/:title", async (req, res) => {
  const title = req.params.title.toLowerCase();
  try {
    const response = await axios.get("http://localhost:5000/booksdata");
    const filtered = Object.values(response.data).filter(
      (b) => b.title.toLowerCase() === title
    );

    if (filtered.length > 0) res.send(JSON.stringify(filtered, null, 4));
    else res.status(404).json({ message: "No books found with this title." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = general;
