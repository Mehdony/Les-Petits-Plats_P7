// Model + vue 

export const displayRecipe = (recipe) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("id", recipe.id);
    const cardImg = new Image();
    const timer = document.createElement("div");
    timer.classList.add("title-time");
    const name = document.createElement("h2");
    name.classList.add("name");
    name.innerHTML = recipe.name;
    const timeContainer = document.createElement("div");
    timeContainer.classList.add("time-container");
    const timeIcon = new Image();
    timeIcon.src = "../images/Time.svg";
    timeIcon.classList.add("time");
    const duration = document.createElement("p");
    duration.classList.add("duration");
    duration.innerHTML = recipe.time + " min";
    const infosContainer = document.createElement("div");
    infosContainer.classList.add("info");
    const ingredientsList = document.createElement("ul");
    ingredientsList.classList.add("ingredients");
    recipe.ingredients.map((element) => {
      const ingredient = document.createElement("li");
      ingredient.classList.add("ingredient");
      ingredient.innerHTML =
        element.ingredient + " " + element.quantity + " " + element.unit;
      ingredientsList.appendChild(ingredient);
    });
  
    const description = document.createElement("p");
    description.classList.add("description");
    description.innerHTML = recipe.description;
    card.appendChild(cardImg);
    card.appendChild(timer);
    timer.appendChild(name);
    timer.appendChild(timeContainer);
    timeContainer.appendChild(timeIcon);
    timeContainer.appendChild(duration);
    card.appendChild(infosContainer);
    infosContainer.appendChild(ingredientsList);
    infosContainer.appendChild(description);
    // console.log(card);
    const recipeContainer = document.querySelector(".recipes-container");
    recipeContainer.appendChild(card);
    return card;
  };