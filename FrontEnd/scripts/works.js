// Récupération des projets du site depuis l'API

const works = await fetch("http://localhost:5678/api/works").then(works => works.json())
const categories = await fetch("http://localhost:5678/api/categories").then(categories => categories.json())


function showWorks(works) {    
    // Effacer l'ancienne gallerie
    const galleryContent = document.querySelector('.gallery')
    galleryContent.innerHTML = ""

    // Affichage de la gallerie 
    for (let i=0; i < works.length; i++) {
        // Reconstruction des balises
        const figureTag = document.createElement('figure')
        const imageElement = document.createElement('img')
        imageElement.src = works[i].imageUrl // ajout de l'url de l'image
        imageElement.alt = works[i].title // ajout de la balise Alt
        const figcaptionTag = document.createElement('figcaption')
        figcaptionTag.innerText = works[i].title
        
        // Affichage elements
        figureTag.appendChild(imageElement)
        figureTag.appendChild(figcaptionTag)
        galleryContent.appendChild(figureTag)
    }
}

//afficher les boutons de categorie



showWorks(works)