document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const query = document.getElementById('query').value;
    fetchRecipes(query);
});

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

document.querySelector('.close').onclick = function () {
    document.getElementById('recipeModal').style.display = "none";
}

window.onclick = function (event) {
    const modal = document.getElementById('recipeModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

let currentPage = 0;

function fetchRecipes(query) {
    const diet = document.getElementById('diet').value;
    const health = document.getElementById('health').value;
    const API_BASE_URL = "https://api.edamam.com/api/recipes/v2";
    const API_ID = "607b1d41";
    const API_KEY = "23e3fbad7cf81eeeee2cda398d2a0034";// Replace with your actual Application Key

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
                document.getElementById('nextPage').disabled = !data.more;
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
            <button onclick="showRecipeDetails('${encodeURIComponent(recipe.uri)}')">More Details</button>
            <a href="${recipe.url}" target="_blank">View Recipe</a>
        `;
        recipesDiv.appendChild(recipeElement);
    });
}

function showRecipeDetails(uri) {
    const recipeDetailsDiv = document.getElementById('recipeDetails');
    const modal = document.getElementById('recipeModal');
    modal.style.display = "block";

    const API_BASE_URL = "https://api.edamam.com/api/recipes/v2";
    const API_ID = "607b1d41";
    const API_KEY = "23e3fbad7cf81eeeee2cda398d2a0034";
    const encodedUri = encodeURIComponent(uri);

    console.log(`Fetching details for: ${API_BASE_URL}/${encodedUri}?type=public&app_id=${API_ID}&app_key=${API_KEY}`);

    fetch(`${API_BASE_URL}/${encodedUri}?type=public&app_id=${API_ID}&app_key=${API_KEY}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
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


// Function to save a recipe to favorites
function saveToFavorites(recipe) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push(recipe);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Recipe saved to favorites!');
}

// Function to display recipes and include "Save to Favorites" button
function displayRecipes(recipes) {
    const recipesDiv = document.getElementById('recipes');
    recipesDiv.innerHTML = ''; // Clear existing recipes

    recipes.forEach(hit => {
        const recipe = hit.recipe;
        const recipeElement = document.createElement('div');
        recipeElement.classList.add('recipe');

        // Create elements for recipe details
        const title = document.createElement('h3');
        title.textContent = recipe.label;

        const ingredients = document.createElement('p');
        ingredients.textContent = recipe.ingredientLines.join(', ');

        const detailsButton = document.createElement('button');
        detailsButton.textContent = 'More Details';
        detailsButton.addEventListener('click', () => showRecipeDetails(encodeURIComponent(recipe.uri)));

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save to Favorites';
        // Using closure to capture the current recipe in the loop
        saveButton.addEventListener('click', () => saveToFavorites(recipe));

        const viewLink = document.createElement('a');
        viewLink.setAttribute('href', recipe.url);
        viewLink.setAttribute('target', '_blank');
        viewLink.textContent = 'View Recipe';

        // Append all elements to the recipeElement
        recipeElement.appendChild(title);
        recipeElement.appendChild(ingredients);
        recipeElement.appendChild(detailsButton);
        recipeElement.appendChild(saveButton);
        recipeElement.appendChild(viewLink);

        // Append the recipeElement to the recipesDiv
        recipesDiv.appendChild(recipeElement);
    });
}

// showRecipeDetails function to include nutrition information

async function showRecipeDetails(uri) {
    const recipeDetailsDiv = document.getElementById('recipeDetails');
    const modal = document.getElementById('recipeModal');
    modal.style.display = "block";

    const API_BASE_URL = "https://api.edamam.com/api/recipes/v2";
    const API_ID = "607b1d41";
    const API_KEY = "23e3fbad7cf81eeeee2cda398d2a0034";

    try {
        const response = await fetch(`${API_BASE_URL}/${uri}?type=public&app_id=${API_ID}&app_key=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const recipe = data.recipe;

        // Building the HTML content
        let htmlContent = `
            <h2>${recipe.label}</h2>
            <img src="${recipe.image}" alt="${recipe.label}">
            <p><strong>Ingredients:</strong> ${recipe.ingredientLines.join(', ')}</p>
            <p><strong>Calories:</strong> ${recipe.calories.toFixed(2)}</p>
            <p><strong>Diet Labels:</strong> ${recipe.dietLabels.join(', ')}</p>
            <p><strong>Health Labels:</strong> ${recipe.healthLabels.join(', ')}</p>
            <p><strong>Nutrients:</strong></p>
            <ul>`;

        // Adding nutrients information
        Object.entries(recipe.totalNutrients).forEach(([key, value]) => {
            htmlContent += `<li>${value.label}: ${value.quantity.toFixed(2)} ${value.unit}</li>`;
        });

        htmlContent += `</ul>`;
        recipeDetailsDiv.innerHTML = htmlContent;
    } catch (error) {
        console.error('Error fetching recipe details:', error);
        recipeDetailsDiv.innerHTML = '<p>Failed to retrieve recipe details. Please try again later.</p>';
    }
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

// Function to display recipes and include data attributes for calories
function displayRecipes(recipes) {
    const recipesDiv = document.getElementById('recipes');
    recipesDiv.innerHTML = ''; // Clear existing recipes

    recipes.forEach(hit => {
        const recipe = hit.recipe;
        const recipeElement = document.createElement('div');
        recipeElement.classList.add('recipe');
        recipeElement.dataset.calories = recipe.calories.toFixed(2); // Data attribute for calories

        // Constructing inner HTML
        recipeElement.innerHTML = `
            <h3>${recipe.label}</h3>
            <p>${recipe.ingredientLines.join(', ')}</p>
            <button onclick="showRecipeDetails('${encodeURIComponent(recipe.uri)}')">More Details</button>
            <button onclick="saveToFavorites('${encodeURIComponent(JSON.stringify(recipe))}')">Save to Favorites</button>
            <a href="${recipe.url}" target="_blank">View Recipe</a>
        `;

        recipesDiv.appendChild(recipeElement);
    });
}

// Function to sort recipes by calories
function sortRecipesByCalories(order) {
    const recipes = document.querySelectorAll('.recipe');
    const sortedRecipes = Array.from(recipes).sort((a, b) => {
        const caloriesA = parseFloat(a.dataset.calories);
        const caloriesB = parseFloat(b.dataset.calories);
        return order === 'asc' ? caloriesA - caloriesB : caloriesB - caloriesA;
    });

    const recipesDiv = document.getElementById('recipes');
    recipesDiv.innerHTML = ''; // Clear existing recipes
    sortedRecipes.forEach(recipe => recipesDiv.appendChild(recipe));
}

// Simplified modal close functionality
document.querySelector('.close').onclick = function () {
    const modal = document.getElementById('recipeModal');
    modal.style.display = "none";
};