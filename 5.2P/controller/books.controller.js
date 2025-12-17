const bookService = require("../services/books.service");

const getAllBooks = (req, res) => {
  res.json(bookService.getAllBooks());
};

const getBookById = (req, res) => {
  const book = bookService.getBookById(req.params.id);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  res.json(book);
};

module.exports = { getAllBooks, getBookById };