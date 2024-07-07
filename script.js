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

// A function to save a recipe to favorites
function saveToFavorites(recipe) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push(recipe);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Recipe saved to favorites!');
}

// Modify displayRecipes function to include "Save to Favorites" button
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
            <button onclick="showRecipeDetails('${encodeURIComponent(recipe.uri)}')">More Details</button>
            <button onclick="saveToFavorites(${JSON.stringify(recipe)})">Save to Favorites</button>
            <a href="${recipe.url}" target="_blank">View Recipe</a>
        `;
        recipesDiv.appendChild(recipeElement);
    });
}

//showRecipeDetails function to include nutrition information
function showRecipeDetails(uri) {
    const recipeDetailsDiv = document.getElementById('recipeDetails');
    const modal = document.getElementById('recipeModal');
    modal.style.display = "block";

    const API_BASE_URL = "https://api.edamam.com/api/recipes/v2";
    const API_ID = "607b1d41";
    const API_KEY = "23e3fbad7cf81eeeee2cda398d2a0034";

    fetch(`${API_BASE_URL}/${uri}?type=public&app_id=${API_ID}&app_key=${API_KEY}`)
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
                <p><strong>Nutrients:</strong></p>
                <ul>
                    ${Object.entries(recipe.totalNutrients).map(([key, value]) => `<li>${value.label}: ${value.quantity.toFixed(2)} ${value.unit}</li>`).join('')}
                </ul>
            `;
        })
        .catch(error => {
            console.error('Error fetching recipe details:', error);
            recipeDetailsDiv.innerHTML = '<p>Failed to retrieve recipe details. Please try again later.</p>';
        });
}

// Add this function to control pagination
function updatePaginationControls(data) {
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');

    prevButton.disabled = currentPage === 0;
    nextButton.disabled = !data.more;

    prevButton.onclick = () => {
        if (currentPage > 0) {
            currentPage--;
            fetchRecipes(document.getElementById('query').value);
        }
    };

    nextButton.onclick = () => {
        if (data.more) {
            currentPage++;
            fetchRecipes(document.getElementById('query').value);
        }
    };
}

// Modify fetchRecipes function to call updatePaginationControls
function fetchRecipes(query) {
    const diet = document.getElementById('diet').value;
    const health = document.getElementById('health').value;
    const API_BASE_URL = "https://api.edamam.com/api/recipes/v2";
    const API_ID = "your_actual_api_id"; // Replace with your actual Application ID
    const API_KEY = "your_actual_api_key"; // Replace with your actual Application Key

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
                updatePaginationControls(data);
            } else {
                displayError('No recipes found. Please try another search.');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            displayError('Failed to retrieve recipes. Please try again later.');
        });
}

// Add this function to sort recipes by calories
function sortRecipesByCalories(order) {
    const recipes = document.querySelectorAll('.recipe');
    const sortedRecipes = Array.from(recipes).sort((a, b) => {
        const caloriesA = parseFloat(a.dataset.calories);
        const caloriesB = parseFloat(b.dataset.calories);
        if (order === 'asc') {
            return caloriesA - caloriesB;
        } else {
            return caloriesB - caloriesA;
        }
    });
    const recipesDiv = document.getElementById('recipes');
    recipesDiv.innerHTML = '';
    sortedRecipes.forEach(recipe => recipesDiv.appendChild(recipe));
}

// DisplayRecipes function to include data attributes for calories
function displayRecipes(recipes) {
    const recipesDiv = document.getElementById('recipes');
    recipesDiv.innerHTML = '';
    recipes.forEach(hit => {
        const recipe = hit.recipe;
        const recipeElement = document.createElement('div');
        recipeElement.classList.add('recipe');
        recipeElement.dataset.calories = recipe.calories.toFixed(2); // Data attribute for calories
        recipeElement.innerHTML = `
            <h3>${recipe.label}</h3>
            <p>${recipe.ingredientLines.join(', ')}</p>
            <button onclick="showRecipeDetails('${encodeURIComponent(recipe.uri)}')">More Details</button>
            <button onclick="saveToFavorites(${JSON.stringify(recipe)})">Save to Favorites</button>
            <a href="${recipe.url}" target="_blank">View Recipe</a>
        `;
        recipesDiv.appendChild(recipeElement);
    });
}

// Modal close functionality to handle errors
document.querySelector('.close').onclick = function () {
    const modal = document.getElementById('recipeModal');
    if (modal.style.display === "block") {
        modal.style.display = "none";
    } else {
        console.error('Modal is not open.');
    }
};
