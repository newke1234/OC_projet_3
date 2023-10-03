/**
 * Fonction pour  gérer le bouton oui de la modale "logout"
 * Le bouton "non" est géré avec la fonction "closeModal"
 */

/**
 * Fonction Ouvrir une boite modale
 * @param {*} event 
 */
function openModal (modal) {
    // event.preventDefault()
    // modal = document.querySelector(event.target.getAttribute('href'))
    console.log(modal)
    modal.classList.remove("hidden")
    modal.setAttribute("aria-hidden", false)
    modal.setAttribute("aria-modal", true)
    document.querySelector('body').classList.add('no-scroll')
    if (modal.id === "modal-logout") modalLogout()
    if (modal.id === "modal-main")  modalBackOffice()
    modal.addEventListener("click", () => closeModal(modal))
    modal.querySelector(".js-modal-close").addEventListener("click", () => closeModal(modal))
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
} 

/**
 * Fermer une Boite modale
 * @param {*} event 
 * @returns 
 */
function closeModal (modal) {
    if (modal === null) return
    event.preventDefault()
    modal.classList.add("hidden")
    modal.setAttribute("aria-hidden", true)
    modal.setAttribute("aria-modal", false)
    modal.removeEventListener("click", () => openModal(modal))
    modal = null
}

/**
 * Fonction : Empeche la propagation du clic de souris aux éléments enfants de la boîte modale
 * @param {*} event 
 */
const stopPropagation = function (event) {
    event.stopPropagation()
}

function modalLogout() {
    const answerLogoutButtons = document.getElementById("yes-button")
    answerLogoutButtons.addEventListener('click', () => {
        window.sessionStorage.removeItem("token")
        window.location.href = "./index.html"
    })
}

/**
 * Fonction pour valider une opération
 */
const validation = function validateAndDelete() {

}

/**
 * Fonction pour afficher la page modale principale (backOffice)
 */
async function modalBackOffice() {
    works = await fetch("http://localhost:" + apiPort + "/api/works").then(works => works.json())
    const showGallery = document.querySelector(".showGallery")
    showGallery.innerHTML = ""
    const modalMain = document.querySelector("#modal-main")
    modalMain.classList.remove('hidden')
    modalMain.setAttribute("aria-modal", "true")
    document.querySelector('body').classList.add('no-scroll')
    showGalleryFunction(works, showGallery)
}

function showGalleryFunction(works, showGallery) {
    // Affichage de la gallerie 
    for (let i=0; i < works.length; i++) {
        const figureTag = document.createElement("figure")
        const imageElement = document.createElement("img")
        imageElement.src = works[i].imageUrl // ajout de l"url de l"image
        imageElement.alt = works[i].title // ajout de la balise Alt
        const trashIconLink = document.createElement("a")
        trashIconLink.setAttribute("href", "#modal-validateDelete")
        trashIconLink.classList.add("trash")
        trashIconLink.classList.add("js-bins-modal")
        const trashIcon = document.createElement("i")
        trashIconLink.setAttribute("data-id", works[i].id)
        trashIcon.setAttribute("data-id", works[i].id)
        trashIcon.classList.add("fa-regular")
        trashIcon.classList.add("fa-trash-can")
        trashIcon.innerHTML = ""
        trashIconLink.appendChild(trashIcon)
        figureTag.appendChild(imageElement) // Affichage les nouveaux elements
        figureTag.appendChild(trashIconLink) // Affichage de l'icon trash
        showGallery.appendChild(figureTag)
        // test des poubelles
    }
    
    showGallery.querySelectorAll('.js-bins-modal').forEach(a => {
        a.addEventListener('click', (event) => {
            modal = document.querySelector(event.target.parentNode.getAttribute("href"))
            console.log(modal)
            openModal(modal)
        })
    })
    
}

