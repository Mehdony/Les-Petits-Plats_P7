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
let appliancesTags = [];
let ustensilsTags = [];
let selectedTags = [];
let mainStr = "";
let mainSearch = false;
let searchLenght = 0;

function filterIng(elt, str) {
  for (let i = 0; i < elt.ingredients.length; i++) {
    const ingredient = elt.ingredients[i];
    if (ingredient.ingredient.toLowerCase().includes(str.toLowerCase())) {
      return true;
    }
  }
}

// use for loop methhod for main search
document.querySelector(".main-search").addEventListener("input", (e) => {
  const str = e.target.value;
  let searchRecipes =
    str.length < searchLenght ? [...datas.recipes] : [...filteredRecipes];
  console.log("clg de search recipe ", searchRecipes);

  mainStr = str;
  let filtered = [];
  if (str.length >= 3) {
    console.log(str);
    for (let i = 0; i < searchRecipes.length; i++) {
      const elt = searchRecipes[i];
      if (
        elt.name.toLowerCase().includes(str.toLowerCase()) ||
        filterIng(elt, str) ||
        elt.description.toLowerCase().includes(str.toLowerCase())
      ) {
        filtered.push(elt);
      }
    }

    mainSearch = true;
    document.querySelector(".recipes-container").innerHTML = "";

    filteredRecipes = [...filtered];

    if (filteredRecipes.length > 0) {
      refreshUI();
    } else {
      document.querySelector(".recipes-container").innerHTML = `
    <div class="no-result">
      <p>Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.</p>
    </div>
    `;
    }
  }
  if (str.length < searchLenght && selectedTags.length === 0) {
    mainSearch = false;
    filteredRecipes = [...searchRecipes];
    console.log("blablabla" ,filteredRecipes);
    refreshUI();
  } else if (str.length < searchLenght && selectedTags.length > 0) {
    console.log("je suis la")
    mainSearch = false;
    filteredRecipes = [...searchRecipes];
    searchByTags();
    refreshUI();
  }
  searchLenght = str.length;
});

// Recherche par ingrédient via l'input de saisie
document.querySelector(".ingredients_input").addEventListener("input", (e) => {
  updateIngredientsTags();
});

document.querySelector(".appliance_input").addEventListener("input", (e) => {
  updateAppliancesTags();
});

document.querySelector(".ustensils_input").addEventListener("input", (e) => {
  updateUstensilsTags();
});

//  On actualise les recettes en fonction des tags sélectionnés
const searchByTags = () => {
  filteredRecipes = filteredRecipes.filter((recipe) => {
    let result = true;
    selectedTags.forEach((tag) => {
      if (tag.type === "ingredient") {
        result =
          result &&
          recipe.ingredients.some(
            (ingredient) => ingredient.ingredient.toLowerCase() === tag.value
          );
      } else if (tag.type === "appliance") {
        result = result && recipe.appliance.toLowerCase() === tag.value;
      } else if (tag.type === "ustensil") {
        const lowercased = recipe.ustensils.map((name) => name.toLowerCase());
        result = result && lowercased.includes(tag.value);
      }
    });
    return result;
  });

  refreshUI();
};

// mise à jour du tableau "ingredientTags"
const updateIngredientsTags = () => {
  // on crée un tableau qui va contenir la liste des ingrédients des recettes ( filtrées ou non )
  ingredientsTags = [];
  const inputContainer = document.querySelector(".ingredients_input");
  let searchKey = inputContainer.value;
  // pour chaque recette
  filteredRecipes.forEach((recipe) => {
    // on boucle sur les ingrédients de la recette
    recipe.ingredients.forEach((ingredient) => {
      // on vérifie si l'ingrédient n'est pas déjà dans le tableau
      if (!ingredientsTags.includes(ingredient.ingredient.toLowerCase())) {
        // si il n'est pas dans le tableau on l'ajoute
        if (
          ingredient.ingredient.toLowerCase().includes(searchKey.toLowerCase())
        ) {
          ingredientsTags.push(ingredient.ingredient.toLowerCase());
        }
      }
    });
  });

  // si l'ingredients est contenu dans selectedTags on le supprime de la liste ingredientsTags
  ingredientsTags = ingredientsTags.filter((ingredient) => {
    return !selectedTags.some((tag) => tag.value === ingredient);
  });

  // on récupère le container qui va contenir l'ul
  const ingredientsContainer = document.querySelector("#ingredient-tags");
  // on crée l'ul qui va contenir les li
  const ingredientsList = document.createElement("ul");
  ingredientsList.classList.add("tags-ul");

  // suppression de l'ancienne liste
  const ul = ingredientsContainer.querySelector(".tags-ul");
  if (ul) {
    ul.remove();
  }

  // actualisation de la liste avec ingredientsTags ( excluant les tags déjà sélectionnés )
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
  createBlueTag();

  console.log(ingredientsTags);
};

const updateAppliancesTags = () => {
  appliancesTags = [];
  const inputContainer = document.querySelector(".appliance_input");
  let searchKey = inputContainer.value;

  filteredRecipes.forEach((recipe) => {
    if (!appliancesTags.includes(recipe.appliance.toLowerCase())) {
      if (recipe.appliance.toLowerCase().includes(searchKey.toLowerCase())) {
        appliancesTags.push(recipe.appliance.toLowerCase());
      }
    }
  });

  appliancesTags = appliancesTags.filter((appliance) => {
    return !selectedTags.some((tag) => tag.value === appliance);
  });

  const appliancesContainer = document.querySelector("#appliance-tags");
  const appliancesList = document.createElement("ul");
  appliancesList.classList.add("tags-ul-appliance");

  const ul = appliancesContainer.querySelector(".tags-ul-appliance");
  if (ul) {
    ul.remove();
  }

  appliancesContainer.appendChild(appliancesList);
  appliancesTags.forEach((appliance) => {
    appliancesList.innerHTML += `<li class="appliance-tag">${appliance}</li>`;
  });

  document.querySelectorAll(".appliance-tag").forEach((tag) => {
    tag.addEventListener("click", (e) => {
      if (!selectedTags.includes(tag.innerHTML)) {
        e.preventDefault();
        selectedTags.push({
          type: "appliance",
          value: tag.innerHTML,
        });
        searchByTags();
      }
    });
  });

  createGreenTag();
};

const updateUstensilsTags = () => {
  ustensilsTags = [];
  const inputContainer = document.querySelector(".ustensils_input");
  let searchKey = inputContainer.value;

  filteredRecipes.forEach((recipe) => {
    recipe.ustensils.forEach((ustensil) => {
      if (!ustensilsTags.includes(ustensil.toLowerCase())) {
        if (ustensil.toLowerCase().includes(searchKey.toLowerCase())) {
          ustensilsTags.push(ustensil.toLowerCase());
        }
      }
    });
  });

  ustensilsTags = ustensilsTags.filter((ustensil) => {
    return !selectedTags.some((tag) => tag.value === ustensil);
  });

  const ustensilsContainer = document.querySelector("#ustensil-tags");
  const ustensilsList = document.createElement("ul");
  ustensilsList.classList.add("tags-ul-ustensil");

  const ul = ustensilsContainer.querySelector(".tags-ul-ustensil");
  if (ul) {
    ul.remove();
  }

  ustensilsContainer.appendChild(ustensilsList);
  ustensilsTags.forEach((ustensil) => {
    ustensilsList.innerHTML += `<li class="ustensil-tag">${ustensil}</li>`;
  });

  document.querySelectorAll(".ustensil-tag").forEach((tag) => {
    tag.addEventListener("click", (e) => {
      if (!selectedTags.includes(tag.innerHTML)) {
        e.preventDefault();
        selectedTags.push({
          type: "ustensil",
          value: tag.innerHTML,
        });
        searchByTags();
      }
    });
  });

  createRedTag();
};

// création du tag au desssu des filtres
const createBlueTag = () => {
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
      p.classList.add("tag");
      p.classList.add("blueTag");
      // on ajoute le nom de l'ingrédient dans le paragraphe
      p.innerText = leTag;
      // on ajoute le paragraphe dans le container
      container.appendChild(p);
      p.innerHTML += `<img src='images/closeIc.svg' class='closeIcon' data-tag='${leTag}'>`;
      p.setAttribute("data-tag", leTag);
      // on retire le tag de la liste des tags
      li.remove();
      p.addEventListener("click", (e) => {
        deleteTag(e);
        if (mainSearch) {
          filteredRecipes = [...filteredRecipes].filter((recipe) => {
            return (
              recipe.name.toLowerCase().includes(mainStr.toLowerCase()) ||
              recipe.description
                .toLowerCase()
                .includes(mainStr.toLowerCase()) ||
              recipe.ingredients.some((ingredient) =>
                ingredient.ingredient
                  .toLowerCase()
                  .includes(mainStr.toLowerCase())
              )
            );
          });
          searchByTags();
        } else {
          filteredRecipes = [...recipes];
          searchByTags();
        }
      });
    });
  });
};

const createGreenTag = () => {
  const applianceLi = document.querySelectorAll(".appliance-tag");
  applianceLi.forEach((li) => {
    li.addEventListener("click", (e) => {
      e.preventDefault();
      const leTag = e.target.innerText;
      console.log(leTag);
      const container = document.querySelector("#tags");
      const p = document.createElement("p");
      p.classList.add("tag");
      p.classList.add("greenTag");
      p.innerText = leTag;
      container.appendChild(p);
      p.innerHTML += `<img src='images/closeIc.svg' class='closeIcon' data-tag='${leTag}'>`;
      p.setAttribute("data-tag", leTag);
      li.remove();
      p.addEventListener("click", (e) => {
        deleteTag(e);
        if (mainSearch) {
          filteredRecipes = recipes.filter((recipe) => {
            return (
              recipe.name.toLowerCase().includes(mainStr.toLowerCase()) ||
              recipe.description
                .toLowerCase()
                .includes(mainStr.toLowerCase()) ||
              recipe.ingredients.some((ingredient) =>
                ingredient.ingredient
                  .toLowerCase()
                  .includes(mainStr.toLowerCase())
              )
            );
          });
          searchByTags();
        } else {
          // document.querySelector(".recipes-container").innerHTML = "";
          filteredRecipes = recipes;
          searchByTags();
        }
      });
    });
  });
};

const createRedTag = () => {
  const ustensilLi = document.querySelectorAll(".ustensil-tag");
  ustensilLi.forEach((li) => {
    li.addEventListener("click", (e) => {
      e.preventDefault();
      const leTag = e.target.innerText;
      console.log(leTag);
      const container = document.querySelector("#tags");
      const p = document.createElement("p");
      p.classList.add("tag");
      p.classList.add("redTag");
      p.innerText = leTag;
      container.appendChild(p);
      p.innerHTML += `<img src='images/closeIc.svg' class='closeIcon' data-tag='${leTag}'>`;
      p.setAttribute("data-tag", leTag);
      li.remove();
      p.addEventListener("click", (e) => {
        deleteTag(e);
        if (mainSearch) {
          filteredRecipes = recipes.filter((recipe) => {
            return (
              recipe.name.toLowerCase().includes(mainStr.toLowerCase()) ||
              recipe.description
                .toLowerCase()
                .includes(mainStr.toLowerCase()) ||
              recipe.ingredients.some((ingredient) =>
                ingredient.ingredient
                  .toLowerCase()
                  .includes(mainStr.toLowerCase())
              )
            );
          });
          searchByTags();
        } else {
          // document.querySelector(".recipes-container").innerHTML = "";
          filteredRecipes = recipes;
          searchByTags();
        }
      });
    });
  });
};

function deleteTag(e) {
  console.log(e.target);
  e.currentTarget.remove();
  updateIngredientsTags();
  selectedTags = selectedTags.filter((tag) => {
    return tag.value !== e.target.getAttribute("data-tag");
  });
  searchByTags();

  if (selectedTags.length === 0) {
    filteredRecipes = recipes;
  }

  console.log(filteredRecipes);
  refreshUI();
}

// rafrachissement de l'interface utilisateur
const refreshUI = () => {
  document.querySelector(".recipes-container").innerHTML = "";
  filteredRecipes.map((recipe) => {
    displayRecipe(recipe);
    return;
  });
  updateIngredientsTags();
  updateAppliancesTags();
  updateUstensilsTags();
};

refreshUI();

// Ouverture et fermeture du menu filtre
let click = false;

const inputContainer = document.querySelector(".ingredients_input");
const blue = document.querySelector("#ingredient-tags");
const box = document.querySelector(".input_container");
const blueArrow = document.querySelector("#blue-arrow");
inputContainer.addEventListener("click", (e) => {
  if (!click) {
    document.querySelector("#ingredient-tags").style.display = "block";
    box.style.borderRadius = "5px 5px 0 0";
    blue.style.borderRadius = "0 0 5px 5px";
    inputContainer.style.width = "100%";
    blueArrow.style.transform = "rotate(180deg)";
    click = true;
  } else {
    document.querySelector("#ingredient-tags").style.display = "none";
    box.style.borderRadius = "5px";
    blueArrow.style.transform = "rotate(0deg)";
    inputContainer.style.width = "170px";
    click = false;
  }
});

const inputApplianceContainer = document.querySelector(".appliance_input");
const green = document.querySelector("#appliance-tags");
const boxGreen = document.querySelector(".input_container-green");
const greenArrow = document.querySelector("#green-arrow");
inputApplianceContainer.addEventListener("click", (e) => {
  if (!click) {
    document.querySelector("#appliance-tags").style.display = "block";
    boxGreen.style.borderRadius = "5px 5px 0 0";
    green.style.borderRadius = "0 0 5px 5px";
    inputApplianceContainer.style.width = "100%";
    greenArrow.style.transform = "rotate(180deg)";
    click = true;
  } else {
    document.querySelector("#appliance-tags").style.display = "none";
    boxGreen.style.borderRadius = "5px";
    inputApplianceContainer.style.width = "170px";
    greenArrow.style.transform = "rotate(0deg)";
    click = false;
  }
});

const inputUstensilContainer = document.querySelector(".ustensils_input");
const red = document.querySelector("#ustensil-tags");
const boxRed = document.querySelector(".input_container-red");
const redArrow = document.querySelector("#red-arrow");
inputUstensilContainer.addEventListener("click", (e) => {
  if (!click) {
    document.querySelector("#ustensil-tags").style.display = "block";
    boxRed.style.borderRadius = "5px 5px 0 0";
    red.style.borderRadius = "0 0 5px 5px";
    inputUstensilContainer.style.width = "100%";
    redArrow.style.transform = "rotate(180deg)";
    click = true;
  } else {
    document.querySelector("#ustensil-tags").style.display = "none";
    boxRed.style.borderRadius = "5px";
    inputUstensilContainer.style.width = "170px";
    redArrow.style.transform = "rotate(0deg)";
    click = false;
  }
});
