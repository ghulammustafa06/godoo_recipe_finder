// script.js

document.getElementById('searchForm').addEventListener('submit', function (event) {
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


function fetchRecipes(query) {
    const diet = document.getElementById('diet').value;
    const health = document.getElementById('health').value;
    const API_BASE_URL = "https://api.edamam.com/api/recipes/v2";
    const API_ID = "607b1d41";
    const API_KEY = "23e3fbad7cf81eeeee2cda398d2a0034";

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

// Update script.js

let currentPage = 0;

document.getElementById('prevPage').addEventListener('click', function () {
    if (currentPage > 0) {
        currentPage--;
        fetchRecipes(document.getElementById('query').value);
    }
});

document.getElementById('nextPage').addEventListener('click', function () {
    currentPage++;
    fetchRecipes(document.getElementById('query').value);
});

function fetchRecipes(query) {
    const diet = document.getElementById('diet').value;
    const health = document.getElementById('health').value;
    const API_BASE_URL = "https://api.edamam.com/api/recipes/v2";
    const API_ID = "607b1d41";
    const API_KEY = "23e3fbad7cf81eeeee2cda398d2a0034";

    let url = `${API_BASE_URL}?type=public&q=${query}&app_id=${API_ID}&app_key=${API_KEY}&from=${currentPage * 10}&to=${(currentPage + 1) * 10}`;
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
                document.getElementById('prevPage').disabled = currentPage === 0;
                document.getElementById('nextPage').disabled = data.more === false;
            } else {
                displayError('No recipes found. Please try another search.');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            displayError('Failed to retrieve recipes. Please try again later.');
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
            <button onclick="showRecipeDetails('${recipe.uri}')">More Details</button>
            <a href="${recipe.url}" target="_blank">View Recipe</a>
        `;
        recipesDiv.appendChild(recipeElement);
    });
}

function showRecipeDetails(uri) {
    const recipeDetailsDiv = document.getElementById('recipeDetails');
    const modal = document.getElementById('recipeModal');
    modal.style.display = "block";

    fetch(`https://api.edamam.com/api/recipes/v2/${encodeURIComponent(uri)}?type=public&app_id=your_api_id&app_key=your_api_key`)
        .then(response => response.json())
        .then(data => {
            const recipe = data.recipe;
            recipeDetailsDiv.innerHTML = `
                <h2>${recipe.label}</h2>
                <img src="${recipe.image}" alt="${recipe.label}">
                <p><strong>Ingredients:</strong> ${recipe.ingredientLines.join(', ')}</p>
                <p><strong>Calories:</strong> ${recipe.calories.toFixed(2)}</p>
                <p><strong>Diet Labels:</strong> ${recipe.dietLabels.join(', ')}</p>
                <p><strong>Health Labels:</strong> ${recipe.healthLabels.join(', ')}</p>
            `;
        })
        .catch(error => {
            console.error('Error fetching recipe details:', error);
            recipeDetailsDiv.innerHTML = '<p>Failed to retrieve recipe details. Please try again later.</p>';
        });
}

document.querySelector('.close').onclick = function () {
    document.getElementById('recipeModal').style.display = "none";
}

window.onclick = function (event) {
    const modal = document.getElementById('recipeModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}