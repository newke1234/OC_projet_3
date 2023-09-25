

async function showWorks() {

    // Récupération des projets du site via l'API
    const works = await fetch("http://localhost:5678/api/works").then(works => works.json())

    
    // Effacer l'ancienne gallerie
    const galleryContent = document.querySelector('.gallery')
    galleryContent.innerHTML = ""

    // Affichage de la gallerie 
    for (let i=0; i < works.length; i++) {
        // Reconstruction les différentes balises
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

showWorks()