// Récupération des projets du site depuis l"API
let works = await fetch("http://localhost:" + apiPort + "/api/works").then(works => works.json())

// recupération des catégories
const categories = await fetch("http://localhost:" + apiPort + "/api/categories").then(categories => categories.json())
const categoriesSet = new Set(categories) // Set pour éviter les doublons
console.log(categoriesSet)
let worksFiltered = works// Tableau des projets filtrée. Liste complète par défaut
let modal = null

// verifier si un utilisateur est loggué
let tokenSession = JSON.parse(window.sessionStorage.getItem("token"))

if (tokenSession) {
    const menuLogout = document.querySelector(".menu-logout")
    const menuLogin = document.querySelector(".menu-login")
    const modeEdition = document.querySelector(".modeEdition")
    const modifierButton = document.querySelector(".button-modifier")
    modifierButton.classList.remove("hidden")
    menuLogout.classList.remove("hidden")
    menuLogin.classList.add("hidden")
    modeEdition.classList.remove("hidden")
} else {
    showFilterButtons(categoriesSet)
}

showWorks(worksFiltered)

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

// Listener pour modales "logout" et "main"
document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', (event) => {
    modal = document.querySelector(event.target.getAttribute('href'))
    openModal(modal)
    })
})

// Listener Ajout Photo
document.querySelector('.addPhotoButton').addEventListener('click', () => {
    photoGalleryElement.classList.add("hidden")
    addPhotoGalleryElement.classList.remove("hidden")
    document.querySelector(".fa-arrow-left").classList.remove("hidden")
    
    showGalleryFunction()
})

// Listener Fleche 
document.getElementById('arrow').addEventListener('click', () => {
    photoGalleryElement.classList.remove("hidden")
    addPhotoGalleryElement.classList.add("hidden")
    document.querySelector(".fa-arrow-left").classList.add("hidden")
    showGalleryFunction()
})

// Listener bouton Upload image
const photoUploadElement = document.getElementById("file-upload")
const insertFileElement = document.getElementById("insertFile")
const imagePreviewElementDiv = document.getElementById("image-preview")
insertFileElement.addEventListener('click', () => { 
    photoUploadElement.click()
    photoUploadElement.addEventListener('change', (event) => {
        addPhotoFunction (event, insertFileElement)
    })
});
imagePreviewElementDiv.addEventListener('click', () => { 
    photoUploadElement.click()
    photoUploadElement.addEventListener('change', (event) => {
        addPhotoFunction (event, insertFileElement)
    })
});

