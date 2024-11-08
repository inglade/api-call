// app.js

document.getElementById("fetchDataButton").addEventListener("click", fetchMonsters);
document.getElementById("searchButton").addEventListener("click", searchMonsters);

// Function to fetch monster data from the MHW API
async function fetchMonsters() {
    const url = "https://mhw-db.com/monsters";

    try {
        const response = await fetch(url, { method: 'GET' });

        // Handle HTTP errors
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Data not found (404).");
            } else if (response.status === 503) {
                throw new Error("Server error (503). Please try again later.");
            } else {
                throw new Error(`Unexpected error: ${response.status}`);
            }
        }

        const monsters = await response.json();
        displayMonsters(monsters);

    } catch (error) {
        displayError(error.message);
    }
}

// Function to display monster data in HTML
function displayMonsters(monsters) {
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";  // Clear previous content

    monsters.forEach(monster => {
        const monsterDiv = document.createElement("div");
        monsterDiv.classList.add("bg-white", "rounded", "shadow-md", "p-4", "mb-4");

        monsterDiv.innerHTML = `
            <h2 class="text-xl font-semibold">${monster.name}</h2>
            <p><strong>Description:</strong> ${monster.description || "No description available"}</p>
            <p><strong>Type:</strong> ${monster.type}</p>
            <p><strong>Species:</strong> ${monster.species}</p>
        `;

        contentDiv.appendChild(monsterDiv);
    });
}

// Function to display an error message
function displayError(message) {
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = `
        <div class="bg-red-100 text-red-700 p-4 rounded">
            <strong>Error:</strong> ${message}
        </div>
    `;
}

// Function to search and filter monsters based on user input
async function searchMonsters() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    
    if (!searchInput) {
        displayError("Please enter a monster name to search.");
        return;
    }

    try {
        const url = `https://mhw-db.com/monsters`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const monsters = await response.json();
        const filteredMonsters = monsters.filter(monster => 
            monster.name.toLowerCase().includes(searchInput)
        );

        if (filteredMonsters.length > 0) {
            displayMonsters(filteredMonsters);
        } else {
            displayError("No monsters found with that name.");
        }

    } catch (error) {
        displayError("Failed to fetch or filter data. Please try again later.");
    }
}