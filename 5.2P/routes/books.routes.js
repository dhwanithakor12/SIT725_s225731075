const express = require("express");
const router = express.Router();

// FIX: point to controller (not controllers)
const Controllers = require("../controller");

router.get("/", Controllers.booksController.getAllBooks);
router.get("/:id", Controllers.booksController.getBookById);

module.exports = router;
