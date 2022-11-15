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
  updateIngredientsTags();
});

document.querySelector(".appliance_input").addEventListener("input", (e) => {
  const str = e.target.value;
  if (str.length) {
    const filteredRecipes = datas.recipes.filter((recipe) => {
      let correspond = false;
      recipe.appliance.toLowerCase().includes(str.toLowerCase())
        ? (correspond = true)
        : (correspond = false);
      return correspond;
    });
    document.querySelector(".recipes-container").innerHTML = "";
    filteredRecipes.map((recipe) => {
      displayRecipe(recipe);
    });
  }
});

document.querySelector(".ustensils_input").addEventListener("input", (e) => {
  const str = e.target.value;
  if (str.length) {
    const filteredRecipes = datas.recipes.filter((recipe) => {
      let correspond = false;
      recipe.ustensils.forEach((ustensil) => {
        ustensil.toLowerCase().includes(str.toLowerCase())
          ? (correspond = true)
          : (correspond = false);
      });
      return correspond;
    });
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
        result =
          result &&
          recipe.ingredients.some(
            (ingredient) => ingredient.ingredient.toLowerCase() === tag.value
          );
        console.log("CONSOLE LOG DE RESULT", result);
      } else if (tag.type === "appliance") {
        result = result && recipe.appliance.toLowerCase() === tag.value;
      } else if (tag.type === "ustensil") {
        result = result && recipe.ustensils.includes(tag.value);
      }

      //    completer avec les autres types de tags
    });
    return result;
  });

  console.log("CONSOLE LOG DE FILTERED RECIPES ", filteredRecipes);
  console.log("CONSOLE.LOG DE SELECTED TAGS", selectedTags);

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

  ingredientsTags = ingredientsTags.filter((ingredient) => {
    return !selectedTags.some((tag) => tag.value === ingredient);
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
      p.innerHTML += `<img src='images/closeIc.svg' class='closeIcon'>`;
      // on retire le tag de la liste des tags
      li.remove();
      p.addEventListener("click", (e) => {
        deleteTag(e);

      });
    });
  });
  // onclick delete tag
};

function deleteTag(e) {
  console.log(e.target);
  e.currentTarget.remove();
  updateIngredientsTags();
  selectedTags = selectedTags.filter((tag) => {
    return tag.value !== e.target.innerText;
  }
  );
  searchByTags();
  console.log(selectedTags);

  console.log(filteredRecipes)

  if (selectedTags.length === 0) {
    filteredRecipes = recipes;
  }
  
  console.log(filteredRecipes);
  refreshUI()

 
}




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
      p.innerHTML += `<img src='images/closeIc.svg' class='closeIcon'>`;

      li.remove();
      p.addEventListener("click", (e) => {
        deleteTag(e);

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
      p.innerHTML += `<img src='images/closeIc.svg' class='closeIcon'>`;

      li.remove();
      p.addEventListener("click", (e) => {
        deleteTag(e);

      });
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
  updateAppliancesTags();
  updateUstensilsTags();
  // console.log(selectedTags);
  // ***********************************************************************************

  // ***********************************************************************************
};

refreshUI();

// Ouverture et fermeture du menu filtre

let click = false;

const inputContainer = document.querySelector(".ingredients_input");
inputContainer.addEventListener("click", (e) => {
  if (!click) {
    document.querySelector("#ingredient-tags").style.display = "block";
    inputContainer.style.borderRadius = "5px 5px 0 0";
    inputContainer.style.width = "100%";
    click = true;
  } else {
    document.querySelector("#ingredient-tags").style.display = "none";
    inputContainer.style.borderRadius = "5px";
    inputContainer.style.width = "170px";
    click = false;
  }
});

const inputApplianceContainer = document.querySelector(".appliance_input");
inputApplianceContainer.addEventListener("click", (e) => {
  if (!click) {
    document.querySelector("#appliance-tags").style.display = "block";
    inputApplianceContainer.style.borderRadius = "5px 5px 0 0";
    inputApplianceContainer.style.width = "100%";
    click = true;
  } else {
    document.querySelector("#appliance-tags").style.display = "none";
    inputApplianceContainer.style.borderRadius = "5px";
    inputApplianceContainer.style.width = "170px";
    click = false;
  }
});

const inputUstensilContainer = document.querySelector(".ustensils_input");
inputUstensilContainer.addEventListener("click", (e) => {
  if (!click) {
    document.querySelector("#ustensil-tags").style.display = "block";
    inputUstensilContainer.style.borderRadius = "5px 5px 0 0";
    inputUstensilContainer.style.width = "100%";
    click = true;
  } else {
    document.querySelector("#ustensil-tags").style.display = "none";
    inputUstensilContainer.style.borderRadius = "5px";
    inputUstensilContainer.style.width = "170px";
    click = false;
  }
});

//--------------------------------------------------------------
