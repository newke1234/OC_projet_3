// Récupération des projets du site depuis l"API
const works = await fetch("http://localhost:5678/api/works").then(works => works.json())
const categories = await fetch("http://localhost:5678/api/categories").then(categories => categories.json())

const categoriesSet = new Set(categories) // Set pour éviter les doublons
let worksFiltered = works // Tableau des projets filtrée, ici : liste complète par défaut

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
        
        // Affichage elements
        figureTag.appendChild(imageElement)
        figureTag.appendChild(figcaptionTag)
        galleryContent.appendChild(figureTag)
    }
}

{ //afficher les boutons de categorie
const filtresGallery = document.querySelector(".filtres ul")
const listeButton = document.createElement("li")
// Bouton catégorie "Tous"
const buttonCatTous = document.createElement("button")
buttonCatTous.dataset.id = "0"
buttonCatTous.innerText = "Tous"
buttonCatTous.classList.add("button-categorie")
listeButton.appendChild(buttonCatTous)
filtresGallery.appendChild(listeButton)
// Autres boutons categories
categoriesSet.forEach(item => {
    const buttonCat = document.createElement("button")
    buttonCat.classList.add("button-categorie")
    buttonCat.dataset.id = item.id
    buttonCat.innerText = item.name
    const listeButton = document.createElement("li")
    listeButton.appendChild(buttonCat) 
    filtresGallery.appendChild(listeButton)
})

// for (let item of categoriesSet) {
//     const buttonCat = document.createElement("button")
//     buttonCat.classList.add("button-categorie")
//     buttonCat.dataset.id = item.id
//     buttonCat.innerText = item.name
//     listeButton.appendChild(buttonCat) 
//     filtresGallery.appendChild(listeButton)
// }
}

// Listener pour les boutons categories
const filterCategoryButton = document.querySelectorAll(".button-categorie")
for (let i=0; i <filterCategoryButton.length; i++) {
    filterCategoryButton[i].addEventListener("click", (event) => {
        if (parseInt(event.target.dataset.id) !== 0) {
            worksFiltered = works.filter(item => item.categoryId === parseInt(event.target.dataset.id)) // Methode filter()
            showWorks(worksFiltered)
        } else {
            showWorks(works)
        }
    })
}

showWorks(worksFiltered)