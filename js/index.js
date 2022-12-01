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

function createDomTags(list, section) {
    let i = 0
    for(tag of list) {
        let item = document.createElement('a');
        item.setAttribute('onclick', 'selectTag(this)')
        item.classList.add('dropdown-item');
        item.id = section.parentElement.id + '_' + i
        item.textContent = tag;
        section.appendChild(item);
        i++
    }
}

function selectTag(element) {
    const tagSection = document.querySelector('#tags');

    const tag = document.createElement('a');
    tag.innerHTML = element.innerText + '<i class="fa-regular fa-circle-xmark" onclick="removeTag(this, ' + element.id +')"></i>';
    tagSection.appendChild(tag);
    element.style.display = "none";
}

function removeTag(element, tagid) {
    tagid.style.display = "block";
    element.parentElement.remove();
}

function init () {
    /* Create DOM items for ingredient; param 1: get ingredients list, param 2 section queryselected*/
    createDomTags(getIngredients(), document.querySelector(".ingredients-list"));
}

init();