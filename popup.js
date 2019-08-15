// Generate a recipe object with the data in the form
function getValues() {
    let title = document.getElementById('title');
    let author = document.getElementById('author');
    let source = document.getElementById('source');
    let image = document.getElementById('image');
    let ingredients = document.getElementById('ingredients');
    let instructions = document.getElementById('instructions');
    let notes = document.getElementById('notes');
    let servings = document.getElementById('servings');
    let cookingTime = document.getElementById('cookingTime');
    let prepTime = document.getElementById('prepTime');
    let storage = document.getElementById('storage');
    let freezes = document.getElementById('freezes');
    let calories = document.getElementById('calories');
    let protein = document.getElementById('protein');
    let carb = document.getElementById('carb');
    let fat = document.getElementById('fat');
    let tags = document.getElementById('tags');
    let equipment = document.getElementById('equipment');

    return {
        title: title.value,
        author: author.value,
        source: source.value,
        image: image.value,
        ingredients: ingredients.value,
        instructions: instructions.value,
        notes: notes.value,
        servings: servings.value,
        cookingTime: cookingTime.value,
        prepTime: prepTime.value,
        storage: storage.value,
        freezes: freezes.checked,
        macros: {
            calories: calories.value,
            protein: protein.value,
            carbs: carb.value,
            fat: fat.value
        },
        equipment: equipment.value,
        tags: tags.value
    };
}

// Load form elements with recipe data
function displayValues(recipeData) {
    let title = document.getElementById('title');
    let author = document.getElementById('author');
    let source = document.getElementById('source');
    let image = document.getElementById('image');
    let ingredients = document.getElementById('ingredients');
    let instructions = document.getElementById('instructions');
    let notes = document.getElementById('notes');
    let servings = document.getElementById('servings');
    let cookingTime = document.getElementById('cookingTime');
    let prepTime = document.getElementById('prepTime');
    let storage = document.getElementById('storage');
    let freezes = document.getElementById('freezes');
    let calories = document.getElementById('calories');
    let protein = document.getElementById('protein');
    let carb = document.getElementById('carb');
    let fat = document.getElementById('fat');
    let tags = document.getElementById('tags');
    let equipment = document.getElementById('equipment');

    title.value = recipeData.title;
    author.value = recipeData.author;
    source.value = recipeData.source;
    image.value = recipeData.image;
    ingredients.value = recipeData.ingredients;
    instructions.value = recipeData.instructions;
    notes.value = recipeData.notes;
    servings.value = recipeData.servings;
    cookingTime.value = recipeData.cookingTime;
    prepTime.value = recipeData.prepTime;
    storage.value = recipeData.storage;
    freezes.checked = recipeData.freezes;
    calories.value = recipeData.macros.calories;
    protein.value = recipeData.macros.protein;
    carb.value = recipeData.macros.carbs;
    fat.value = recipeData.macros.fat;
    equipment.value = recipeData.equipment;
    tags.value = recipeData.tags;
}

// Save the data from the form in local storage so it can be retrieved after popup closes
function saveData() {
    let recipe = getValues();
    let encodedUrl = encodeURI(url);
    let dataToStore = {};
    dataToStore[encodedUrl] = recipe;
    chrome.storage.local.set(dataToStore, () => { });
}

const recipesUrl = 'http://localhost:3050/api/v1/recipes';
const websiteRecipeUrl = 'http://localhost:3000/recipes/';

// url for this recipe
let url;

// Get title and url from the tab info and load it on the form 
function onTabInfoLoaded(pageDetails) {
    document.getElementById('title').value = pageDetails[0].title;
    url = pageDetails[0].url;
    let siteUrl = new URL(url);
    document.getElementById('source').value = siteUrl.hostname;

    // Check if this URL is already in the database
    // Get the status display DOM element so it can be updated
    let checkRecipeDisplay = document.getElementById('recipe-exists');

    let xhr = new XMLHttpRequest();
    xhr.open('GET', recipesUrl + '/search?url=' + url + '&userId=me', true); // Check if recipe url has been saved already for this user
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    // Handle request state change events
    xhr.onreadystatechange = function () {
        // If the request completed
        if (xhr.readyState == 4) {
            checkRecipeDisplay.innerHTML = '';
            if (xhr.status == 200) {
                let data = xhr.responseText;
                let jsonResponse = JSON.parse(data);
                checkRecipeDisplay.innerHTML = 'This recipe is already saved<br /><a target="_blank" href="' + websiteRecipeUrl + jsonResponse._id + '">Open recipe in website</a>';
                document.getElementById('saverecipeform').style.display = 'none'
            } else if (xhr.status !== 404) { // 404 is not an error, just says the recipe does not exist in the database
                checkRecipeDisplay.innerHTML = 'Error checking for recipe ' + xhr.status;
            }
        }
    };

    // Send the request
    xhr.send();

    // Popup closes every time user clicks outside, data needs to be saved
    // every time it is changed and loaded every time the popup is opened
    let encodedUrl = encodeURI(url);
    chrome.storage.local.get(encodedUrl, (data) => {
        if(data[encodedUrl]) {
            displayValues(data[encodedUrl]);
        }
    });
}

// Send recipe to server
function saveRecipe() {
    // Cancel the form submit
    event.preventDefault();
    // Get the status display DOM element so it can be updated
    let statusDisplay = document.getElementById('status-display');

    let xhr = new XMLHttpRequest();
    xhr.open('POST', recipesUrl, true); // Creating a new recipe -> POST method
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    // Get recipe object from form data
    let recipe = getValues();
    recipe.url = url;
    // recipe.source = source;
    recipe.userId = 'me'; // TODO: change for real user id - need user to log in?

    // Handle request state change events
    xhr.onreadystatechange = function () {
        // If the request completed
        if (xhr.readyState == 4) {
            statusDisplay.innerHTML = '';
            let htmlToShow = '';
            if (xhr.status == 200) {
                htmlToShow = 'Recipe saved';
                let data = xhr.responseText;
                let jsonResponse = JSON.parse(data);
                if (jsonResponse._id) { // Just in case we ever get a response without _id
                   htmlToShow += '<br /><a target="_blank" href="' + websiteRecipeUrl + jsonResponse._id + '?edit=true">Open recipe in website</a>';
                }
                statusDisplay.innerHTML = htmlToShow;
            } else {
                statusDisplay.innerHTML = 'Error saving ' + xhr.status;
            }
        }
    };

    // Send the request and set status
    xhr.send(JSON.stringify(recipe));
    statusDisplay.innerHTML = 'Saving...';
}

// Popup loaded
window.addEventListener('load', function (evt) {

    // Get information from the tab and populate form
    chrome.tabs.query({ active: true, currentWindow: true}, onTabInfoLoaded);
    

    // When submitting form, save the recipe
    document.getElementById('saverecipeform')
        .addEventListener('submit', saveRecipe);
    
    let recipeForm = document.getElementById('saverecipeform');
    recipeForm.onchange = saveData;
});

window.addEventListener('click',function(e){
  if(e.target.href!==undefined){
    chrome.tabs.create({url:e.target.href})
  }
});
