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


//  main search
document.querySelector(".main-search").addEventListener("input", (e) => {
  const str = e.target.value;
  if (str.length >= 3) {
    console.log(str);
    filteredRecipes = datas.recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(str.toLowerCase())
    );
    console.log(filteredRecipes);
    document.querySelector(".recipes-container").innerHTML = "";
    refreshUI();
  }
});


// Recherche par ingrédient via l'input de saisie
document.querySelector(".ingredients_input").addEventListener("input", (e) => {
  const str = e.target.value;
  if (str.length) {
    console.log(str);
    const filteredRecipes = datas.recipes.filter((recipe) => {
      let correspond = false;
      recipe.ingredients.forEach((ingredient) => {
        if (ingredient.ingredient.toLowerCase().includes(str.toLowerCase())) {
          correspond = true;
        }
      });
      return correspond;
    });

    console.log(filteredRecipes);
    document.querySelector(".recipes-container").innerHTML = "";
    filteredRecipes.map((recipe) => {
      displayRecipe(recipe);
    });
  }
});


//  On actualise les recettes en fonction des tags sélectionnés
const searchByTags = () => {
  filteredRecipes = filteredRecipes.filter((recipe) => {
    let result = true;
    selectedTags.forEach((tag) => {
      if (tag.type === "ingredient") {
        result = result && recipe.ingredients.some((ingredient) => ingredient.ingredient.toLowerCase() === tag.value);
        console.log('CONSOLE LOG DE RESULT', result);
      }
      //    completer avec les autres types de tags
    });
    return result;
  });
  console.log( "CONSOLE LOG DE FILTERED RECIPES ",filteredRecipes);
  // Pourquoi quand on ajoute un nouveau tag il duplique puis se triple puis se quadruplique etc...
  console.log("CONSOLE.LOG DE SELECTED TAGS", selectedTags);
  
  refreshUI();
};



// mise à jour du tableau "ingredientTags"
const updateIngredientsTags = () => {
  // on crée un tableau qui va contenir la liste des ingrédients des recettes ( filtrées ou non )
  ingredientsTags = [];
  // pour chaque recette  
  filteredRecipes.forEach((recipe) => {
    // on boucle sur les ingrédients de la recette
    recipe.ingredients.forEach((ingredient) => {
      // on vérifie si l'ingrédient n'est pas déjà dans le tableau
      if (!ingredientsTags.includes(ingredient.ingredient.toLowerCase())) {
        // si il n'est pas dans le tableau on l'ajoute
        ingredientsTags.push(ingredient.ingredient.toLowerCase());
      }
    });
  });

  // on récupère le container qui va contenir l'ul
  const ingredientsContainer = document.querySelector("#ingredient-tags");
  // on crée l'ul qui va contenir les li
  const ingredientsList = document.createElement("ul");
  ingredientsList.classList.add("tags-ul");

  const ul = ingredientsContainer.querySelector(".tags-ul");
  if (ul) {
    ul.remove();
  }


  ingredientsContainer.appendChild(ingredientsList);
  ingredientsTags.forEach((ingredient) => {
    ingredientsList.innerHTML += `<li class="ingredient-tag">${ingredient}</li>`;
  });

  // pour chacuns des tags on ajoute un event listener
  document.querySelectorAll(".ingredient-tag").forEach((tag) => {
    tag.addEventListener("click", (e) => {
      // au click sur le tag si il n'est pas dans selectedTags on l'ajoute ( le tag sur lequel on a cliqué )
      if (!selectedTags.includes(tag.innerHTML)) {
        e.preventDefault();
        // on push dans selectedTags un objet avec le type et la valeur du tag
        selectedTags.push({
          type: "ingredient",
          value: tag.innerHTML,
        });
        searchByTags();
        
      }
    });
  });
};

// création du tag au desssu des filtres 
const createTag = () => {
  // on récupère la liste de tous les ingrédients dans la liste 
  const ingredientLi = document.querySelectorAll(".ingredient-tag");
  // on boucle sur la liste des ingrédients
  ingredientLi.forEach((li) => {
    // on ajoute un event listener au click
    li.addEventListener("click", (e) => {
      e.preventDefault();
      // on récupère la valeur de l'ingrédient
      const leTag = e.target.innerText;
      console.log(leTag);
      // On récupère le container qui va contenir les tags
      const container = document.querySelector("#tags");
      // on crée un par qui va contenir le nom de l'ingrédient sélectionné
      const p = document.createElement("p");
      // on ajoute le nom de l'ingrédient dans le paragraphe
      p.innerText = leTag;
      // on ajoute le paragraphe dans le container
      container.appendChild(p);
      // on retire le tag de la liste des tags
      li.remove();
    });
  });
};

// rafrachissement de l'interface utilisateur
const refreshUI = () => {
  document.querySelector(".recipes-container").innerHTML = "";
  filteredRecipes.map((recipe) => {
    displayRecipe(recipe);
    return;
  });
  updateIngredientsTags();
  // console.log(selectedTags);
  // ***********************************************************************************
  createTag()
  // ***********************************************************************************

}

refreshUI();


// Ouverture et fermeture du menu filtre

let click = false;

const inputContainer = document.querySelector(".ingredients_input");
inputContainer.addEventListener("click", (e) => {
  if (!click) {
    document.querySelector("#ingredient-tags").style.display = "block";
    inputContainer.style.width = "100%";
    click = true;
  } else {
    document.querySelector("#ingredient-tags").style.display = "none";
    inputContainer.style.width = "170px";
    click = false;
  }
});
