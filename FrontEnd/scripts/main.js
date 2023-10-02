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

/**
 * Fonction Ouvrir une boite modale
 * @param {*} event 
 */
const openModal = function (event) {
    event.preventDefault()
    const target = document.querySelector(event.target.getAttribute('href'))
    modal = target
    modal.classList.remove("hidden")
    modal.setAttribute("aria-hidden", false)
    modal.setAttribute("aria-modal", true)
    document.querySelector('body').classList.add('no-scroll')
    // console.log(modal.id)
    if (modal.id === "modal-logout") modalLogout
    modal.addEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)

} 

/**
 * Fermer une Boite modale
 * @param {*} event 
 * @returns 
 */
const closeModal = function (event) {
    if (modal === null) return
    event.preventDefault()
    modal.classList.add("hidden")
    modal.setAttribute("aria-hidden", true)
    modal.setAttribute("aria-modal", false)
    modal.removeEventListener("click", openModal)
    modal = null
}

/**
 * Fonction : Empeche la propagation du clic de souris aux éléments enfants de la boîte modale
 * @param {*} event 
 */
const stopPropagation = function (event) {
    event.stopPropagation()
}

// Listener pour modales "logout" et "main"

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)
})

/*
// Listener bouton logout
const menuLogout = document.querySelector('.menu-logout')
menuLogout.addEventListener('click', () => {
    const popupLogout = document.querySelector('.modal-logout')

    const answerLogoutAnswerButtons = document.querySelectorAll('.modal-logout div button')
    for (let i=0; i < answerLogoutAnswerButtons.length; i++) {
        answerLogoutAnswerButtons[i].addEventListener('click', (event) => {
            popupLogout.setAttribute("aria-modal", "false")
            if (event.target.dataset.answer === "yes") {
                window.sessionStorage.removeItem("token")
                window.location.href = "./index.html"
            } else {
                popupLogout.classList.add('hidden')
                document.querySelector('body').classList.remove('no-scroll')
                return
            }
        })
    }
})

//Listener bouton modifier
const modalMain = document.querySelector(".modal-main")
const modifierButton = document.querySelector(".button-modifier")
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


