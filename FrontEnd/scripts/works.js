
async function getWorks () {
    try {
        const response = await fetch("http://localhost:" + apiPort + "/api/works");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const works = await response.json();
        return works;
    } catch (error) {
        console.error("Error fetching works:", error);
        throw error;
    }
}


/**
 * Cette fonction affiche les projets
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
        imageElement.src = worksFiltered[i].imageUrl; // ajout de l"url de l"image
        imageElement.alt = worksFiltered[i].title; // ajout de la balise Alt
        const figcaptionTag = document.createElement("figcaption");
        figcaptionTag.innerText = worksFiltered[i].title;
        figureTag.appendChild(imageElement); // Affichage les nouveaux éléments
        figureTag.appendChild(figcaptionTag);
        galleryContent.appendChild(figureTag);
    }
}


/**
 * 
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