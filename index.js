import { recipes } from "../recipes.js";
import { displayRecipe } from "../utils/recipeView.js";
console.log("log de toutes les recettes ", recipes);

let datas = {};
datas.recipes = recipes;

datas.recipes.map((recipe) => {
  console.log("log de chaque recette", recipe);
  displayRecipe(recipe);
  return;
});
