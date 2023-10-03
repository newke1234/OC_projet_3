// Récupération des projets du site depuis l"API
let works = await fetch("http://localhost:" + apiPort + "/api/works").then(works => works.json())
let categories = await fetch("http://localhost:" + apiPort + "/api/categories").then(categories => categories.json())
let categoriesSet = new Set(categories) // Set pour éviter les doublons
let worksFiltered = works // Tableau des projets filtrée. Liste complète par défaut
let modal = null

// verifier si un utilisateur est loggué
let tokenSession = JSON.parse(window.sessionStorage.getItem("token"))
// tokenSession = ("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4") // je suis loggué
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

const modalMain = document.getElementById("modal-main")

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


/*

//Listener bouton modifier

modifierButton.addEventListener("click", async () => {
    works = await fetch("http://localhost:" + apiPort + "/api/works").then(works => works.json())
    const showGallery = document.querySelector(".showGallery")
    showGallery.innerHTML = ""
    // const modalMain = document.querySelector(".modal-main")
    modalMain.classList.remove('hidden')
    modalMain.setAttribute("aria-modal", "true")
    document.querySelector('body').classList.add('no-scroll')
    // Affichage de la gallerie 
    for (let i=0; i < works.length; i++) {
        const figureTag = document.createElement("figure")
        const imageElement = document.createElement("img")
        imageElement.src = works[i].imageUrl // ajout de l"url de l"image
        imageElement.alt = works[i].title // ajout de la balise Alt
        figureTag.appendChild(imageElement) // Affichage les nouveaux elements
        showGallery.appendChild(figureTag)

    }
})

*/

//listener Croix de fermeture de la modale
// const crossIcon = document.querySelector(".fa-xmark")
// crossIcon.addEventListener('click', () => {
//     modalMain.classList.add('hidden')
//     modalMain.classList.remove('no-scroll')
//     document.querySelector('body').classList.remove('no-scroll')
// })


