/**
 * Pour récuperer les projets sur la base de données
 * @returns 
 */
async function getWorks() {
    try {
        document.getElementById("errorGallery").innerHTML = ""
        const answer = await fetch("http://localhost:" + apiPort + "/api/works");
        if (!answer.ok) {
            
            throw new Error(`Erreur HTTP Status: ${response.status}`);
        }
        const works = await answer.json();
        return works;
    } catch (error) {
        document.getElementById("errorGallery").innerHTML = "<p>Erreur en essayant de récupérer les données : Accès au serveur impossible</p>";
        console.error("Erreur en essayant de récupérer les données:", error);
        throw error;
    }
}

/**
 * Cette fonction affiche les projets filtrés sur la page d'accueil
 * @param {*} worksFiltered 
 */
function showWorks(worksFiltered) {
    // Effacer l"ancienne gallerie
    const galleryContent = document.querySelector(".gallery");
    galleryContent.innerHTML = "";

    // Affichage de la gallerie 
    for (let i = 0; i < worksFiltered.length; i++) {
        // Reconstruction des balises
        const figureTag = document.createElement("figure");
        const imageElement = document.createElement("img");
        
        // ajout de l"url de l"image / L'url doit être adaptée au port utilisé, car la port 5678 est utilisé par défaut dans l'url de la base de donnée.
        imageElement.src = worksFiltered[i].imageUrl.replace(/localhost:[0-9]+/,`localhost:${apiPort}`);  
        imageElement.alt = worksFiltered[i].title; // ajout de la balise Alt
        const figcaptionTag = document.createElement("figcaption");
        figcaptionTag.innerText = worksFiltered[i].title;
        figureTag.appendChild(imageElement); // Affichage les nouveaux éléments
        figureTag.appendChild(figcaptionTag);
        galleryContent.appendChild(figureTag);
    }
}

/**
 * Cette fonction affiche les boutons de filtre sur la page d'accueil
 * @param {*} categories 
 */
function showFilterButtons(categories) {
    const filtresGallery = document.querySelector(".filtres ul");
    const listeButton = document.createElement("li");
    const buttonCatTous = document.createElement("button"); // Bouton catégorie "Tous"
    buttonCatTous.dataset.id = "0";
    buttonCatTous.innerText = "Tous";
    buttonCatTous.classList.add("button-categorie");
    listeButton.appendChild(buttonCatTous);
    filtresGallery.appendChild(listeButton);
    categories.forEach(item => { // Autres boutons catégories
        const buttonCat = document.createElement("button");
        buttonCat.classList.add("button-categorie");
        buttonCat.dataset.id = item.id;
        buttonCat.innerText = item.name;
        const listeButton = document.createElement("li");
        listeButton.appendChild(buttonCat); 
        filtresGallery.appendChild(listeButton);
    });
}
