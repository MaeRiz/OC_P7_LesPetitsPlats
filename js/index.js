let searchCriteriaTags = {
    "bar": "",
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

let tagsList = {
    "ingredients": getIngredients(),
    "appliances": getAppliances(),
    "ustensils": getUstensils()
}

function createDomTags(list, section, category) {
    section.innerHTML = "";
    let i = 0
    for(tag of list) {
        let item = document.createElement('a');
        item.setAttribute('onclick', `selectTag(this, '${category}')`);
        item.classList.add('dropdown-item');
        item.id = section.parentElement.id + '_' + i;
        item.textContent = tag;
        section.appendChild(item);
        i++;
    }
}

function selectTag(thisitem, category) {

    const tagSection = document.querySelector('#tags');
    const searchTagBar = thisitem.parentElement.parentElement.childNodes[3]; //Searchbar Tag
    searchTagBar.focus();
    
    searchCriteriaTags[`${category}s`].push(thisitem.innerText);
    tagsList[`${category}s`].splice(tagsList[`${category}s`].indexOf(thisitem.innerText), 1);

    const tag = document.createElement('a');
    tag.classList.add(category + "_tag");
    tag.innerHTML = thisitem.innerText + `<i class="fa-regular fa-circle-xmark" onclick="removeTag(this, '${category}')"></i>`;
    tagSection.appendChild(tag);

    updateTags(); 

}

function removeTag(thisitem, category) {

    tagsList[`${category}s`].push(thisitem.parentElement.innerText);
    searchCriteriaTags[`${category}s`].splice(searchCriteriaTags[`${category}s`].indexOf(thisitem.parentElement.innerText), 1);
    thisitem.parentElement.remove();
    updateTags();
}

function searchTag(element) {
    filter = element.value.toUpperCase();
    a = element.nextSibling.nextSibling.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
            } else {
            a[i].style.display = "none";
        }
    }
  }

function createRecipeDOM(list) {
    const RecipesContainer = document.querySelector('#recipes');
    RecipesContainer.innerHTML = '';

    if(list.length <= 0){
        RecipesContainer.innerHTML = '<h4>Aucune recette ne correspond à vos critères... Vous pouvez chercher "Tarte aux pommes", "Poisson", etc...</h4>';
    } else {
        for(let i = 0; i < list.length; i++){

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
    
            list[i].ingredients.forEach(element => {
                const ingredientDOM = document.createElement('li');
    
                if (element.quantity === undefined) {element.quantity = "";} else {element.quantity = `: ${element.quantity}`};
                if (element.unit === undefined) {element.unit = "";};
                if (element.unit === "grammes"){element.unit = "g"};
    
                ingredientDOM.innerHTML = `<span class="ingredient-name">${element.ingredient}</span>${element.quantity} ${element.unit}`;
                ingredients.appendChild(ingredientDOM);
            });
    
            title.innerHTML = list[i].name;
            time.innerHTML = ` <i class="fa-regular fa-clock"></i> ${list[i].time} Min`;
            desc.innerHTML = list[i].description;
    
            details.appendChild(title);
            details.appendChild(time);
            details.appendChild(ingredients);
            details.appendChild(desc);
    
            recipe_card.appendChild(details);
    
            RecipesContainer.appendChild(recipe_card);
        }
    }

}

function updateRecipeList(type) {
    // Mise a jour de la liste a partir des criteres
    // récupération des nouveau tags avec les fonctions getIngredients, getAppliances, getUstensils
    //createDomTags(ingredients_list, document.querySelector("#ingredients-list"));
    //createDomTags(appliances_list, document.querySelector("#appliances-list"));
    //createDomTags(ustensils_list, document.querySelector("#ustensils-list"));
}

function updateTags() {
    createDomTags(tagsList.ingredients, document.querySelector("#ingredients-list"), "ingredient");
    createDomTags(tagsList.appliances, document.querySelector("#appliances-list"), "appliance");
    createDomTags(tagsList.ustensils, document.querySelector("#ustensils-list"), "ustensil");
};

function init () {
    createRecipeDOM(recipes);
    /* Create DOM items for ingredient; param 1: get ingredients list, param 2 section queryselected*/
    updateTags()

    document.querySelector("#search-bar").addEventListener('input', function() {
        if(this.value.length >= 3){
            searchCriteriaTags.bar = this.value;
        }
      });
}   

init();