// Récupération des projets du site depuis l'API
const works = await fetch("http://localhost:5678/api/works").then(works => works.json())
const categories = await fetch("http://localhost:5678/api/categories").then(categories => categories.json())

const worksSet = new Set()
const categoriesSet = new Set()
worksSet.add (works)
categoriesSet.add(categoriesSet)

for (let item of worksSet) {
    for (let object of item) {
    console.log (object.title)}
}

let worksFiltered = works // Liste des projets après filtres, complète par défaut


function showWorks(worksFiltered) {    
    // Effacer l'ancienne gallerie
    const galleryContent = document.querySelector('.gallery')
    galleryContent.innerHTML = ""

    // Affichage de la gallerie 
    for (let i=0; i < worksFiltered.length; i++) {
        // Reconstruction des balises
        const figureTag = document.createElement('figure')
        const imageElement = document.createElement('img')
        imageElement.src = worksFiltered[i].imageUrl // ajout de l'url de l'image
        imageElement.alt = worksFiltered[i].title // ajout de la balise Alt
        const figcaptionTag = document.createElement('figcaption')
        figcaptionTag.innerText = worksFiltered[i].title
        
        // Affichage elements
        figureTag.appendChild(imageElement)
        figureTag.appendChild(figcaptionTag)
        galleryContent.appendChild(figureTag)
    }
}

{ //afficher les boutons de categorie
const filtresGallery = document.querySelector(".filtres ul")
const listeButton = document.createElement('li')
    // Bouton catégorie "Tous"
const buttonCatTous = document.createElement('button')
buttonCatTous.dataset.id = '0'
buttonCatTous.innerText = "Tous"
buttonCatTous.classList.add('button-categorie')
listeButton.appendChild(buttonCatTous)
filtresGallery.appendChild(listeButton)
    // Autres bouton categories
for (let i=0; i <categories.length; i++) {
    const buttonCat = document.createElement('button')
    buttonCat.classList.add('button-categorie')
    buttonCat.dataset.id = i+1
    buttonCat.innerText = categories[i].name
    listeButton.appendChild(buttonCat) 
    filtresGallery.appendChild(listeButton)
}
}

// function filterByCategorie (worksSet, categoriesSet) {
const filterCategoryButton = document.querySelectorAll(".button-categorie")
for (let i=0; i <filterCategoryButton.length; i++) {
    filterCategoryButton[i].addEventListener('click', (event) => {
        if (parseInt(event.target.dataset.id) !== 0) {
            worksFiltered = works.filter((item) => item.categoryId === parseInt(event.target.dataset.id))
            showWorks(worksFiltered)
        } else {
            showWorks(works)
        }
    })
}

showWorks(worksFiltered)