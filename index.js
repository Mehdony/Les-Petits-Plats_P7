// Récuperation des datas
import { recipes } from "../recipes.js";
// Récuperation des fonctions d'affichage des recettes
import { displayRecipe } from "../utils/recipeView.js";
// console.log("log de toutes les recettes ", recipes);

//  Création d'un objet data
let datas = {};
// Création de la clé recipes dans l'objet data au quel on ajoute les recettes
datas.recipes = recipes;

// On boucle sur les recettes pour les afficher grâce a la fonction displayRecipe
datas.recipes.map((recipe) => {
  //   console.log("log de chaque recette", recipe);
  displayRecipe(recipe);
  return;
});


document.querySelector(".main-search").addEventListener("input", (e) => {
  const str = e.target.value;
  if (str.length >= 3) {
    console.log(str);
    const filteredRecipes = datas.recipes.filter((recipe) => recipe.name.toLowerCase().includes(str.toLowerCase()) );
    console.log(filteredRecipes);
  }
});
