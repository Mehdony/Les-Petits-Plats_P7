document.querySelector(".main-search").addEventListener("input", (e) => {
  const str = e.target.value;
  mainStr = str;
  if (str.length >= 3) {
    console.log(str);
    filteredRecipes = datas.recipes.filter(
      (recipe) =>
        recipe.name.toLowerCase().includes(str.toLowerCase()) ||
        recipe.ingredients.some((ingredient) =>
          ingredient.ingredient.toLowerCase().includes(str.toLowerCase())
        ) ||
        recipe.description.toLowerCase().includes(str.toLowerCase())
    );
    mainSearch = true;
    console.log(filteredRecipes);
    document.querySelector(".recipes-container").innerHTML = "";
    if (filteredRecipes.length === 0) {
      document.querySelector(".recipes-container").innerHTML = `
    <div class="no-result">
      <p>Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.</p>
    </div>
    `;
    } else {
      refreshUI();
    }
  }
  if (str.length < 3) {
    mainSearch = false;
    filteredRecipes = datas.recipes;
    refreshUI();
  }
});