// creer un fichier JS avec les constantes (pour le port de l'API par ex)
console.log (apiPort)
// Récupération des projets du site depuis l"API
let works = await fetch("http://localhost:" + apiPort + "/api/works").then(works => works.json())
let categories = await fetch("http://localhost:" + apiPort + "/api/categories").then(categories => categories.json())

let categoriesSet = new Set(categories) // Set pour éviter les doublons
let worksFiltered = works // Tableau des projets filtrée, ici : liste complète par défaut

/**
 * Cette fonction affiche les projets
 * @param {*} worksFiltered 
 */
function showWorks(worksFiltered) {    
    // Effacer l"ancienne gallerie
    const galleryContent = document.querySelector(".gallery")
    galleryContent.innerHTML = ""

    // Affichage de la gallerie 
    for (let i=0; i < worksFiltered.length; i++) {
        // Reconstruction des balises
        const figureTag = document.createElement("figure")
        const imageElement = document.createElement("img")
        imageElement.src = worksFiltered[i].imageUrl // ajout de l"url de l"image
        imageElement.alt = worksFiltered[i].title // ajout de la balise Alt
        const figcaptionTag = document.createElement("figcaption")
        figcaptionTag.innerText = worksFiltered[i].title
        figureTag.appendChild(imageElement) // Affichage les nouveaux elements
        figureTag.appendChild(figcaptionTag)
        galleryContent.appendChild(figureTag)
    }
}

/**
 * Cette fonction affiche les boutons de categorie
 */
function showFilterButtons() {
    const filtresGallery = document.querySelector(".filtres ul")
    const listeButton = document.createElement("li")
    const buttonCatTous = document.createElement("button")  // Bouton catégorie "Tous"
    buttonCatTous.dataset.id = "0"
    buttonCatTous.innerText = "Tous"
    buttonCatTous.classList.add("button-categorie")
    listeButton.appendChild(buttonCatTous)
    filtresGallery.appendChild(listeButton)
    categoriesSet.forEach(item => {   // Autres boutons categories
        const buttonCat = document.createElement("button")
        buttonCat.classList.add("button-categorie")
        buttonCat.dataset.id = item.id
        buttonCat.innerText = item.name
        const listeButton = document.createElement("li")
        listeButton.appendChild(buttonCat) 
        filtresGallery.appendChild(listeButton)
    })
}

showFilterButtons()

// Listener pour les boutons categories 
const filterCategoryButton = document.querySelectorAll(".button-categorie")
for (let i=0; i <filterCategoryButton.length; i++) {
    filterCategoryButton[i].addEventListener("click", async (event) => {
        works = await fetch("http://localhost:" + apiPort + "/api/works").then(works => works.json())
        if (parseInt(event.target.dataset.id) !== 0) {
            worksFiltered = works.filter(item => item.categoryId === parseInt(event.target.dataset.id)) // Methode filter()
            showWorks(worksFiltered)
        } else {
            showWorks(works)
        }
    })
}

showWorks(worksFiltered)