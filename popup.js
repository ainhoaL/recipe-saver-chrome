// Generate a recipe object with the data in the form
function getValues() {
    var title = document.getElementById('title');
    var author = document.getElementById('author');
    var image = document.getElementById('image');
    var ingredients = document.getElementById('ingredients');
    var instructions = document.getElementById('instructions');
    var notes = document.getElementById('notes');
    var servings = document.getElementById('servings');
    var cookingTime = document.getElementById('cookingTime');
    var prepTime = document.getElementById('prepTime');
    var storage = document.getElementById('storage');
    var freezes = document.getElementById('freezes');
    var calories = document.getElementById('calories');
    var protein = document.getElementById('protein');
    var carb = document.getElementById('carb');
    var fat = document.getElementById('fat');
    var tags = document.getElementById('tags');
    var equipment = document.getElementById('equipment');

    return {
        title: title.value,
        author: author.value,
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
    var title = document.getElementById('title');
    var author = document.getElementById('author');
    var image = document.getElementById('image');
    var ingredients = document.getElementById('ingredients');
    var instructions = document.getElementById('instructions');
    var notes = document.getElementById('notes');
    var servings = document.getElementById('servings');
    var cookingTime = document.getElementById('cookingTime');
    var prepTime = document.getElementById('prepTime');
    var storage = document.getElementById('storage');
    var freezes = document.getElementById('freezes');
    var calories = document.getElementById('calories');
    var protein = document.getElementById('protein');
    var carb = document.getElementById('carb');
    var fat = document.getElementById('fat');
    var tags = document.getElementById('tags');
    var equipment = document.getElementById('equipment');

    title.value = recipeData.title;
    author.value = recipeData.author;
    image.value = recipeData.image;
    ingredients.value = recipeData.ingredients;
    instructions.value = recipeData.instructions;
    notes.value = recipeData.notes;
    servings.value = recipeData.servings;
    cookingTime.value = recipeData.cookingTime;
    prepTime.value = recipeData.prepTime;
    storage.value = recipeData.storage;
    freezes.checked = recipeData.freezes;
    calories.value = recipeData.calories;
    protein.value = recipeData.protein;
    carb.value = recipeData.carb;
    fat.value = recipeData.fat;
    equipment.value = recipeData.equipment;
    tags.value = recipeData.tags;
}

// Save the data from the form in local storage so it can be retrieved after popup closes
function saveData() {
    let recipe = getValues();
    chrome.storage.local.set({ 'recipeData': recipe }, () => { });
}

// url for this recipe
var source;

// Get title and url from the tab info and load it on the form 
function onTabInfoLoaded(pageDetails) {
    document.getElementById('title').value = pageDetails[0].title;
    source = pageDetails[0].url;
}

// Send recipe to remote server
function saveRecipe() {
    // Cancel the form submit
    event.preventDefault();
    // Get the status display DOM element so it can be updated
    let statusDisplay = document.getElementById('status-display');

    let recipesUrl = 'http://localhost:3050/api/recipes';
    let xhr = new XMLHttpRequest();
    xhr.open('PUT', recipesUrl, true); // Creating a new recipe -> PUT method
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    // Get recipe object from form data
    let recipe = getValues();
    recipe.source = source;

    // Handle request state change events
    xhr.onreadystatechange = function () {
        // If the request completed
        if (xhr.readyState == 4) {
            statusDisplay.innerHTML = '';
            if (xhr.status == 200) {
                // If it was a success, close the popup after a short delay
                statusDisplay.innerHTML = 'Recipe saved';
                window.setTimeout(window.close, 1000);
            } else {
                statusDisplay.innerHTML = 'Error saving';
            }
        }
    };

    // Send the request and set status
    xhr.send(JSON.stringify(recipe));
    statusDisplay.innerHTML = 'Saving...';
}

// Popup loaded
window.addEventListener('load', function (evt) {
    // When submitting form, save the recipe
    document.getElementById('saverecipeform')
        .addEventListener('submit', saveRecipe);
    
    // Popup closes every time user clicks outside, data needs to be saved
    // every time it is changed and loaded every time the popup is opened
    chrome.storage.local.get('recipeData', (data) => displayValues(data.recipeData));
    let recipeForm = document.getElementById('saverecipeform');
    recipeForm.onchange = saveData;

    // Get information from the tab and populate form
    chrome.tabs.query({ active: true, currentWindow: true}, onTabInfoLoaded);
});
