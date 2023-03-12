let searchCriterias = {
    "bar": "",
    "ingredients": [],
    "appliances": [],
    "ustensils": []
};

let tagsList = {};
let recipes_list = JSON.parse(JSON.stringify(recipes));

function getIngredients() {
    let ingredientsList =  []

    for(let i = 0; i < recipes_list.length; i++){
        for(let y = 0; y < recipes_list[i].ingredients.length; y++){
            if(!ingredientsList.includes(recipes_list[i].ingredients[y].ingredient)){
                ingredientsList.push(recipes_list[i].ingredients[y].ingredient);
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

    for(let i = 0; i < recipes_list.length; i++){
        if(!appliancesList.includes(recipes_list[i].appliance)) {
            appliancesList.push(recipes_list[i].appliance);
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

    for(let i = 0; i < recipes_list.length; i++){
        for(ustensil of recipes_list[i].ustensils) {
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



function createDomTags(list, section, category) {
    section.innerHTML = "";
    let i = 0
    for(tag of list) {
        if(searchCriterias[`${category}s`].indexOf(tag) === -1){
            let item = document.createElement('a');
            item.setAttribute('onclick', `selectTag(this, '${category}')`);
            item.classList.add('dropdown-item');
            item.id = section.parentElement.id + '_' + i;
            item.textContent = tag;
            section.appendChild(item);
            i++;
        };
    }
}

function selectTag(thisitem, category) {

    const tagSection = document.querySelector('#tags');
    const searchTagBar = thisitem.parentElement.parentElement.childNodes[3]; //Searchbar Tag
    searchTagBar.focus();
    
    searchCriterias[`${category}s`].push(thisitem.innerText);

    const tag = document.createElement('a');
    tag.classList.add(category + "_tag");
    tag.innerHTML = thisitem.innerText + `<i class="fa-regular fa-circle-xmark" onclick="removeTag(this, '${category}')"></i>`;
    tagSection.appendChild(tag);

    updateRecipeList();

}

function removeTag(thisitem, category) {
    searchCriterias[`${category}s`].splice(searchCriterias[`${category}s`].indexOf(thisitem.parentElement.innerText), 1);
    thisitem.parentElement.remove();
    updateRecipeList();
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

function updateRecipeList() {
    
    recipes_list = [];

    /* Filtre de la barre de recherche */
    for (recipe of recipes) {
        if(recipe.name.toUpperCase().indexOf(searchCriterias.bar.toUpperCase()) > -1 || recipe.description.toUpperCase().indexOf(searchCriterias.bar.toUpperCase()) > -1){
            recipes_list.push(recipe);
        } else {
            let ing_list = [];
            for (ing of recipe.ingredients) {
                ing_list.push(ing.ingredient);
            }
            if (ing_list.join(' ').toUpperCase().indexOf(searchCriterias.bar.toUpperCase()) > -1 ){
                recipes_list.push(recipe);
            }
        }
    }

    /* Filtre des ingredients */
    let i = recipes_list.length;
    while(i--) {

        let ing_list = [];
        for (ing of recipes_list[i].ingredients) {
            ing_list.push(ing.ingredient);
        }
        for(ing in searchCriterias.ingredients) {
            if (ing_list.join(' ').toUpperCase().indexOf(searchCriterias.ingredients[ing].toUpperCase()) === -1){
                recipes_list.splice(i, 1);
                break
            }
        }
    }

    /* Filtre des ustensils */
    i = recipes_list.length;
    while(i--) {
        for (ust in searchCriterias.ustensils) {
            if (recipes_list[i].ustensils.join(' ').toUpperCase().indexOf(searchCriterias.ustensils[ust].toUpperCase()) === -1){
                recipes_list.splice(i, 1);
                break
            }
        }
    }

    /* Filtre des appareils */
    i = recipes_list.length;
    while(i--) {
        for (appliance in searchCriterias.appliances) {
            if (recipes_list[i].appliance.toUpperCase() != searchCriterias.appliances[appliance].toUpperCase()){
                recipes_list.splice(i, 1);
                break
            }
        }
    }


    updateTags();
    createRecipeDOM(JSON.parse(JSON.stringify(recipes_list)));
}

function updateTags() {

    tagsList = {
        "ingredients": getIngredients(),
        "appliances": getAppliances(),
        "ustensils": getUstensils()
    }

    createDomTags(tagsList.ingredients, document.querySelector("#ingredients-list"), "ingredient");
    createDomTags(tagsList.appliances, document.querySelector("#appliances-list"), "appliance");
    createDomTags(tagsList.ustensils, document.querySelector("#ustensils-list"), "ustensil");
};

function init () {
    createRecipeDOM(recipes_list);
    updateTags()

    document.querySelector("#search-bar").addEventListener('input', function() {
        searchCriterias.bar = this.value;
        if(this.value.length >= 3 || this.value.length === 0){
            updateRecipeList();
        };
      });
}   

init();