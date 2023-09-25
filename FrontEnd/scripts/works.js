// Récupération des projets du site depuis l'API

const works = await fetch("http://localhost:5678/api/works").then(works => works.json())
const categories = await fetch("http://localhost:5678/api/categories").then(categories => categories.json())

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
        figcaptionTag.innerText = works[i].title
        
        // Affichage elements
        figureTag.appendChild(imageElement)
        figureTag.appendChild(figcaptionTag)
        galleryContent.appendChild(figureTag)
    }
}

//afficher les boutons de categorie
const filtresGallery = document.querySelector(".filtres ul")
const listeButton = document.createElement('li')
const buttonCatTous = document.createElement('button')
buttonCatTous.dataset.cat = 'tous'
buttonCatTous.innerText = 'Tous'

// Bouton Tous
listeButton.appendChild(buttonCatTous)
filtresGallery.appendChild(listeButton)

// Autres bouton categories
for (let i=0; i <categories.length; i++) {
    const buttonCat = document.createElement('button')
    buttonCat.dataset.id = i
    buttonCat.innerText = categories[i].name
    listeButton.appendChild(buttonCat) 
    filtresGallery.appendChild(listeButton)
}

showWorks(works)