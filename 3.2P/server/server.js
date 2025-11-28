const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../Client/Public")));

app.get("/api/recipes", (req, res) => {
  const recipes = [
    {
      id: 1,
      title: "Pav Bhaji",
      description: "Spicy mashed vegetable curry served with buttered pav.",
      time: "30 minutes",
      image: "images/pav.jpeg"
    },
    {
      id: 2,
      title: "Masala Dosa",
      description: "Crispy dosa filled with seasoned potato masala.",
      time: "40 minutes",
      image: "images/dosa.jpeg"
    },
    {
      id: 3,
      title: "Gulab Jamun",
      description: "Sweet milk dumplings soaked in sugar syrup.",
      time: "25 minutes",
      image: "images/gulab.jpeg"
    }
  ];

  res.status(200).json(recipes);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
