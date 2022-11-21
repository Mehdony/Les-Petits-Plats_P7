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
    mainStr = str;
    let filtered = [];
    if (str.length >= 3) {
      console.log(str);
      for (let i = 0; i < filteredRecipes.length; i++) {
        const elt = filteredRecipes[i];
        if (
          elt.name.toLowerCase().includes(str.toLowerCase()) ||
          filterIng(elt, str) ||
          elt.description.toLowerCase().includes(str.toLowerCase())
        ) {
          filtered.push(elt);
        }
      }
      mainSearch = true;
      filteredRecipes = [...filtered];
      console.log(filteredRecipes);
      document.querySelector(".recipes-container").innerHTML = "";
      refreshUI();
      if (str.length <= 3) {
        mainSearch = false;
        filteredRecipes = datas.recipes;
        refreshUI();
      }
    }
  });
  