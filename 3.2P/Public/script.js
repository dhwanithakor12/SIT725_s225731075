
document.addEventListener("DOMContentLoaded", loadRecipes);

async function loadRecipes() {
  try {
    const response = await fetch("/api/recipes");
    const recipes = await response.json();

    const container = document.getElementById("cardContainer");
    container.innerHTML = "";

    recipes.forEach(recipe => {
      container.innerHTML += `
        <div class="col s12 m6 l4">
          <div class="card hoverable z-depth-3">
            <div class="card-image">
              <img src="${recipe.image}" alt="${recipe.title}" style="height: 220px; object-fit: cover;">
              <span class="card-title">${recipe.title}</span>
            </div>
            <div class="card-content">
              <p>${recipe.description}</p>
            </div>
            <div class="card-action">
              <span><strong>Time:</strong> ${recipe.time}</span>
            </div>
          </div>
        </div>
      `;
    });
  } catch (err) {
    console.error("Error loading recipes:", err);
  }
}
