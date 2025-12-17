const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Mount routes (Week-5 style)
const booksRoutes = require("./routes/books.routes");
app.use("/api/books", booksRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});