// script.js

document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = document.getElementById('query').value;
    fetchRecipes(query);
});

function fetchRecipes(query) {
    const API_BASE_URL = "https://api.edamam.com/api/recipes/v2";
    const API_ID = "607b1d41";
    const API_KEY = "23e3fbad7cf81eeeee2cda398d2a0034";

    fetch(`${API_BASE_URL}?type=public&q=${query}&app_id=${API_ID}&app_key=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            displayRecipes(data.hits);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function displayRecipes(recipes) {
    const recipesDiv = document.getElementById('recipes');
    recipesDiv.innerHTML = '';
    recipes.forEach(hit => {
        const recipe = hit.recipe;
        const recipeElement = document.createElement('div');
        recipeElement.classList.add('recipe');
        recipeElement.innerHTML = `
            <h3>${recipe.label}</h3>
            <p>${recipe.ingredientLines.join(', ')}</p>
            <a href="${recipe.url}" target="_blank">View Recipe</a>
        `;
        recipesDiv.appendChild(recipeElement);
    });
}

// Add error message handling in script.js

function fetchRecipes(query) {
    const API_BASE_URL = "https://api.edamam.com/api/recipes/v2";
    const API_ID = "607b1d41";
    const API_KEY = "23e3fbad7cf81eeeee2cda398d2a0034";

    fetch(`${API_BASE_URL}?type=public&q=${query}&app_id=${API_ID}&app_key=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            if (data.hits.length > 0) {
                displayRecipes(data.hits);
            } else {
                displayError('No recipes found. Please try another search.');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            displayError('Failed to retrieve recipes. Please try again later.');
        });
}

function displayError(message) {
    const recipesDiv = document.getElementById('recipes');
    recipesDiv.innerHTML = `<p class="error">${message}</p>`;
}

// Update script.js

function fetchRecipes(query) {
    const diet = document.getElementById('diet').value;
    const health = document.getElementById('health').value;
    const API_BASE_URL = "https://api.edamam.com/api/recipes/v2";
    const API_ID = "your_api_id";
    const API_KEY = "your_api_key";

    let url = `${API_BASE_URL}?type=public&q=${query}&app_id=${API_ID}&app_key=${API_KEY}`;
    if (diet) {
        url += `&diet=${diet}`;
    }
    if (health) {
        url += `&health=${health}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.hits.length > 0) {
                displayRecipes(data.hits);
            } else {
                displayError('No recipes found. Please try another search.');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            displayError('Failed to retrieve recipes. Please try again later.');
        });
}
