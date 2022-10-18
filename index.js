// Récuperation des datas
import { recipes } from "../recipes.js";
// Récuperation des fonctions d'affichage des recettes
import { displayRecipe } from "../utils/recipeView.js";

//  Création d'un objet data
let datas = {};
// Création de la clé recipes dans l'objet data au quel on ajoute les recettes
datas.recipes = recipes;

let filteredRecipes = datas.recipes;
let ingredientsTags = [];
let selectedTags = [];

// On boucle sur les recettes pour les afficher grâce a la fonction displayRecipe

const searchByTags = () => {
    filteredRecipes = filteredRecipes.filter((recipe) => {
        let result = true;
        selectedTags.forEach(tag => {
            if (tag.type === "ingredient") {
                result = result && recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase() === tag.value);
              }
              console.log(result);

        //    completer avec les autres types de tags
        })

        return result;
    });
    refreshUI();
}

const updateIngredientsTags = () => { 
ingredientsTags = [];
filteredRecipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
        if (!ingredientsTags.includes(ingredient.ingredient.toLowerCase())) {
            ingredientsTags.push(ingredient.ingredient.toLowerCase());
        }
    })
})

const ingredientsContainer = document.querySelector("#ingredient-tags");
const ingredientsList = document.createElement("ul");
ingredientsList.classList.add("tags-ul");
ingredientsContainer.appendChild(ingredientsList)
ingredientsTags.forEach(ingredient => {
    ingredientsList.innerHTML += `<li class="ingredient-tag">${ingredient}</li>`
})
// ingredientsContainer.innerHTML += "</ul>";
document.querySelectorAll(".ingredient-tag").forEach(tag => {
    tag.addEventListener("click", () => {
        if (!selectedTags.includes(tag.innerHTML)) {

            selectedTags.push({
                type : "ingredient",
                value : tag.innerHTML
            });
            searchByTags();
            // console.log(selectedTags);
            console.log(filteredRecipes);
        }
    })
})
}

const refreshUI = () => {
  document.querySelector(".recipes-container").innerHTML = "";
filteredRecipes.map((recipe) => {

  displayRecipe(recipe);
  return;
});
updateIngredientsTags();
}
refreshUI() 


//  main search 
document.querySelector(".main-search").addEventListener("input", (e) => {
  const str = e.target.value;
  if (str.length >= 3) {
    console.log(str);
    filteredRecipes = datas.recipes.filter((recipe) => recipe.name.toLowerCase().includes(str.toLowerCase()) );
    console.log(filteredRecipes)
    document.querySelector(".recipes-container").innerHTML = "";
    refreshUI()
  }
});

// Recherche par ingrédient

document.querySelector(".ingredients_input").addEventListener("input", (e) => {
  const str = e.target.value;
  if (str.length) {
    console.log(str);
    const filteredRecipes = datas.recipes.filter((recipe) => 
    {

        let correspond = false;
        recipe.ingredients.forEach(ingredient => {
            if (ingredient.ingredient.toLowerCase().includes(str.toLowerCase())) {
                correspond = true;
            }
        });
    return correspond;    
    
    } );

    console.log(filteredRecipes)
    document.querySelector(".recipes-container").innerHTML = "";
    filteredRecipes.map((recipe) => {
      displayRecipe(recipe);
    });
  }
});

// Menu hamburger input

let click = false;

const inputContainer = document.querySelector(".ingredients_input")
inputContainer.addEventListener("click", (e) => {
  if (!click) {
  document.querySelector("#ingredient-tags").style.display = "block";
 inputContainer.style.width = "100%";
  click = true;
  }else{  
  document.querySelector("#ingredient-tags").style.display = "none";
  inputContainer.style.width = "170px";
  click = false;

  }
});


