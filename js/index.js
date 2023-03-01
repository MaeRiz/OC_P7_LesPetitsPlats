let searchCriteriaTags = {
    "ingredients": [],
    "appliances": [],
    "ustensils": []
}

function getIngredients() {
    let ingredientsList =  []

    for(let i = 0; i < recipes.length; i++){
        for(let y = 0; y < recipes[i].ingredients.length; y++){
            if(!ingredientsList.includes(recipes[i].ingredients[y].ingredient)){
                ingredientsList.push(recipes[i].ingredients[y].ingredient);
            }
        }
    }
    /* Return array sorted by name */
    return (ingredientsList.sort(function (a, b) {
        if (a < b) {return -1;};
        if (a > b) {return 1;};
        return 0;
    }));
}

function getAppliances() {
    let appliancesList = []

    for(let i = 0; i < recipes.length; i++){
        if(!appliancesList.includes(recipes[i].appliance)) {
            appliancesList.push(recipes[i].appliance);
        }
    }
    return (appliancesList.sort(function (a, b) {
        if (a < b) {return -1;};
        if (a > b) {return 1;};
        return 0;
    }));
}

function getUstensils() {
    let ustensilsList = []

    for(let i = 0; i < recipes.length; i++){
        for(ustensil of recipes[i].ustensils) {
            if(!ustensilsList.includes(ustensil)) {
                ustensilsList.push(ustensil);
            }
        }
    }

    return (ustensilsList.sort(function (a, b) {
        if (a < b) {return -1;};
        if (a > b) {return 1;};
        return 0;
    }));
}

function createDomTags(list, section) {
    let i = 0
    for(tag of list) {
        let item = document.createElement('a');
        item.setAttribute('onclick', 'selectTag(this)');
        item.classList.add('dropdown-item');
        item.id = section.parentElement.id + '_' + i;
        item.textContent = tag;
        section.appendChild(item);
        i++;
    }
}

function selectTag(element) {
    const tagSection = document.querySelector('#tags');
    const searchTagBar = element.parentElement.parentElement.childNodes[3];
    searchTagBar.focus();

    const tag = document.createElement('a');
    tag.classList.add(element.parentElement.parentElement.id + "_tag");
    tag.innerHTML = element.innerText + '<i class="fa-regular fa-circle-xmark" onclick="removeTag(this, ' + element.id +')"></i>';
    tagSection.appendChild(tag);
    element.classList.add('selected');

    searchCriteriaTags[element.parentElement.parentElement.id].push(element.innerText);
}

function removeTag(element, tagid) {
    tagid.style.display = "block";
    tagid.classList.remove('selected');
    
    for(cat in searchCriteriaTags) {
        for(i =0; i < searchCriteriaTags[cat].length; i++){
            if(searchCriteriaTags[cat][i] === element.parentElement.innerText) {
                searchCriteriaTags[cat].splice(searchCriteriaTags[cat].indexOf(searchCriteriaTags[cat][i]), 1);
            }
        }
    }

    element.parentElement.remove();
}

function searchTag(element) {
    filter = element.value.toUpperCase();
    a = element.nextSibling.nextSibling.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
      txtValue = a[i].textContent || a[i].innerText;
      if (!a[i].classList.contains("selected")) {
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
          } else {
            a[i].style.display = "none";
        }
      }
    }
  }

function createRecipeDOM(list) {
    const RecipesContainer = document.querySelector('#recipes');
    RecipesContainer.innerHTML = '';

    for(let i = 0; i < recipes.length; i++){

        const recipe_card = document.createElement('div');
        recipe_card.classList.add('recipe-card');

        const details = document.createElement('div');
        details.classList.add('details');

        const title = document.createElement('h3');
        title.classList.add('title');

        const time = document.createElement('p');
        time.classList.add('time');

        const desc = document.createElement('p');
        desc.classList.add('desc');

        const ingredients = document.createElement('ul');
        ingredients.classList.add('ingredient');

        recipes[i].ingredients.forEach(element => {
            const ingredientDOM = document.createElement('li');

            if (element.quantity === undefined) {element.quantity = "";} else {element.quantity = `: ${element.quantity}`};
            if (element.unit === undefined) {element.unit = "";};
            if (element.unit === "grammes"){element.unit = "g"};

            ingredientDOM.innerHTML = `<span class="ingredient-name">${element.ingredient}</span>${element.quantity} ${element.unit}`;
            ingredients.appendChild(ingredientDOM);
        });

        title.innerHTML = recipes[i].name;
        time.innerHTML = ` <i class="fa-regular fa-clock"></i> ${recipes[i].time} Min`;
        desc.innerHTML = recipes[i].description;

        details.appendChild(title);
        details.appendChild(time);
        details.appendChild(ingredients);
        details.appendChild(desc);

        recipe_card.appendChild(details);

        RecipesContainer.appendChild(recipe_card);
    }
}

function updateRecipeList(type) {
    // Mise a jour de la liste a partir des criteres
    // récupération des nouveau tags avec les fonctions getIngredients, getAppliances, getUstensils
    createDomTags(getIngredients(), document.querySelector("#ingredients-list"));
    createDomTags(getAppliances(), document.querySelector("#appliances-list"));
    createDomTags(getUstensils(), document.querySelector("#ustensils-list"));
}

function init () {
    createRecipeDOM(recipes);
    /* Create DOM items for ingredient; param 1: get ingredients list, param 2 section queryselected*/
    createDomTags(getIngredients(), document.querySelector("#ingredients-list"));
    createDomTags(getAppliances(), document.querySelector("#appliances-list"));
    createDomTags(getUstensils(), document.querySelector("#ustensils-list"));
}   

init();