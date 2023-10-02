/**
 * Fonction pour  gérer le bouton oui de la modale "logout"
 * Le bouton "non" est géré avec la fonction "closeModal"
 * @param {*} modalContent 
 */
function modalLogout(modalContent) {
    // const answerLogoutButtons = document.querySelectorAll('#modal-logout div button')
    // for (let i=0; i < answerLogoutButtons.length; i++) {
    const answerLogoutButtons = document.getElementById("yes-button")
    answerLogoutButtons.addEventListener('click', () => {
        window.sessionStorage.removeItem("token")
        window.location.href = "./index.html"
    })
}


async function modalMain (modalContent) {
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
}