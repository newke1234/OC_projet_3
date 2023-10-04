/**
 * Fonction pour  gérer le bouton oui de la modale "logout"
 * Le bouton "non" est géré avec la fonction "closeModal"
 */

// const { validate } = require("json-schema")

/**
 * Fonction Ouvrir une boite modale
 * @param {*} event 
 */
function openModal (modal) {
    modal.classList.remove("hidden")
    modal.setAttribute("aria-hidden", false)
    modal.setAttribute("aria-modal", true)
    document.querySelector('body').classList.add('no-scroll')
    if (modal.id === "modal-logout") modalLogout()
    if (modal.id === "modal-main")  modalBackOffice()
    if (modal.id !== "modal-logout-forced") modal.addEventListener("click", () => closeModal(modal))
    if (modal.querySelector(".js-modal-close")) modal.querySelector(".js-modal-close").addEventListener("click", () => closeModal(modal))
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
} 

/**
 * Fermer une Boite modale
 * @param {*} event 
 * @returns 
 */
function closeModal (modal) {
    if (modal === null) return
    // event.preventDefault()
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
    const answerLogoutButtons = document.getElementById("yes-button-logout")
    answerLogoutButtons.addEventListener("click", () => {
        window.sessionStorage.removeItem("token")
        window.location.href = "./index.html"
    })
}

/**
 * Fonction pour effacer un projet
 */
function modalWorkDelete(workid, modal) {
    const answerWorkDeleteButtons = document.getElementById("yes-button-delete")
    answerWorkDeleteButtons.addEventListener('click', async  () => {
        try {
            let answer = await fetch("http://localhost:" + apiPort + "/api/works/" + workid, { 
                method: "DELETE",
                headers: { "Authorization": "Bearer " + JSON.parse(window.sessionStorage.getItem("token"))}
            }) 

            console.log(answer)
            if (answer.status === 401) { // Si autorisation refusée (token expiré)
                closeModal(modal)
                modal = document.getElementById("modal-logout-forced")
                openModal(modal)
                document.getElementById("ok-logout").addEventListener("click", () => window.location.href = "./login.html") 
              }
            if (answer.status === 404 || answer.status === 500) {
            throw new Error('Opération impossible') 
            }

        } catch (error) {
            console.log(error)
  
        }
    })
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

async function showGalleryFunction(works, showGallery) {
    // Affichage de la gallerie 
    works = await fetch("http://localhost:" + apiPort + "/api/works").then(works => works.json())
    for (let i=0; i < works.length; i++) {
        const figureTag = document.createElement("figure")
        const imageElement = document.createElement("img")
        imageElement.src = works[i].imageUrl // ajout de l"url de l"image
        imageElement.alt = works[i].title // ajout de la balise Alt
        const trashIconLink = document.createElement("a")
        trashIconLink.classList.add("trash")
        trashIconLink.classList.add("js-bins-modal")
        const trashIcon = document.createElement("i")
        trashIconLink.setAttribute("data-id", works[i].id)
        trashIcon.classList.add("fa-regular")
        trashIcon.classList.add("fa-trash-can")
        trashIcon.innerHTML = ""
        trashIconLink.appendChild(trashIcon)
        figureTag.appendChild(imageElement) // Affichage les nouveaux elements
        figureTag.appendChild(trashIconLink) // Affichage de l'icon trash
        showGallery.appendChild(figureTag)
        
    }
    // test des poubelles
    showGallery.querySelectorAll('.js-bins-modal').forEach(a => {
        a.addEventListener('click', (event) => {
            modal = document.getElementById("modal-validateDelete")
            openModal(modal)
            let deleteId = ""
            deleteId = event.target.parentNode.dataset.id
            modalWorkDelete(deleteId, modal)
        })
    })
    
}
