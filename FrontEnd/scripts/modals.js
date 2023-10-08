/**
 * Fonction Ouvrir une page modale
 * @param {*} modal Contenu de la page modale
 */
function openModal (modal) {
    document.querySelector(".modal-message").innerText = ""
    modal.classList.remove("hidden")
    modal.setAttribute("aria-hidden", false)
    modal.setAttribute("aria-modal", true)
    document.querySelector('body').style.overflow = "hidden" // classList.add('no-scroll')
    console.log(modal)
    switch (modal.id) {
        case 'modal-logout':
            logout()
            break

        case 'modal-main':
            showGalleryFunction()
            break

        default:
            break
    }
    if (modal.id !== "modal-logout-forced") 
        modal.addEventListener("click", () => closeModal(modal));
    
    if (modal.querySelector(".js-modal-close")) {
        modal.querySelector(".js-modal-close")
            .addEventListener("click", () => closeModal(modal));
        modal.querySelector(".js-modal-stop")
            .addEventListener("click", stopPropagation);
        } 
    }

/**
 * Fermer une Boite modale
 * @param {*} modal Contenu de la page modale
 * @returns 
 */
function closeModal (modal) {
    if (modal === null) return
    photoGalleryElement.classList.remove("hidden")
    addPhotoGalleryElement.classList.add("hidden")
    document.querySelector(".fa-arrow-left").style.overflow = "auto" //.classList.add("hidden")
    modal.classList.add("hidden")
    document.querySelector('body').classList.remove('no-scroll')
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

function logout() {
    const answerLogoutButtons = document.getElementById("yes-button-logout")
    answerLogoutButtons.addEventListener("click", () => {
        window.sessionStorage.removeItem("token")
        window.location.href = "./index.html"
    })
}

/**
 * Fonction pour effacer un projet
 * @param {workid} workid Id du projet a effacer
 * @param {*} modal contenu de la modale a afficher
 * @return
 */
function modalWorkDelete(workid, modal) {
    const answerWorkDeleteButtons = document.getElementById("yes-button-delete")
    answerWorkDeleteButtons.addEventListener('click', async  () => {
        try {
            let answer = await fetch("http://localhost:" + apiPort + "/api/works/" + workid, { 
                method: "DELETE",
                headers: { "Authorization": "Bearer " + JSON.parse(window.sessionStorage.getItem("token"))}
            }) 
            if (answer.ok) {
                closeModal(modal)
                let deleteOk = document.querySelector(".modal-message")
                deleteOk.style.color = "#1D6154"
                deleteOk.innerText = "Projet supprimé avec succès"
                openModal(modalMain)
                return
            }
            if (answer.status === 401) { // Si autorisation refusée (token expiré)
                closeModal(modal)
                openModal(modalLogoutForced)
                document.getElementById("ok-logout").addEventListener("click", () => window.location.href = "./login.html") 
              }
            if (answer.status === 404 || answer.status === 500) { // si erreur coté API
                let deleteOk = document.querySelector(".modal-message")
                deleteOk.style.color = "red"
                deleteOk.innerText = `Opération impossible - erreur ${answer.status}`
                throw new Error(`Opération impossible - erreur ${answer.status}`)
            }
        } catch (error) {
            console.log(error)
        }
    })
}

async function showGalleryFunction() {
    const showGallery = document.querySelector(".showGallery")
    showGallery.innerHTML = ""
    modalMain.classList.remove('hidden')
    modalMain.setAttribute("aria-modal", "true")
    document.querySelector('body').classList.add('no-scroll')
    // On récupère les projets via l'Api
    works = await fetch("http://localhost:" + apiPort + "/api/works").then(works => works.json())
    for (let i=0; i < works.length; i++) { // Création des balises pour chaque projet
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

    // Listener poubelles
    showGallery.querySelectorAll('.js-bins-modal').forEach(a => {
        a.addEventListener('click', (event) => {
            modal = modalValidateDelete
            openModal(modal)
            let deleteId = ""
            deleteId = event.target.parentNode.dataset.id
            modalWorkDelete(deleteId, modal)
        })
    })
}

/**
 * Fonction pour charger une image et la vérifier
 * @param {*} event 
 * @param {*} insertFileElement 
 * @returns 
 */
function addPhotoFunction (event, insertFileElement) {
    // const insertFileElementBase = insertFileElement
    let errorMessagePhoto = document.querySelector(".modal-message")
    let selectedFile = event.target.files[0]; // Le fichier sélectionné par l'utilisateur
    console.log(errorMessagePhoto)
    let imagePreviewElement = document.getElementById("image-preview")
    let imagePreviewElementIMG = ""

    if (selectedFile) {

        // Accéder aux propriétés du fichier :
        const fileName = selectedFile.name; // Nom du fichier
        const fileSize = selectedFile.size; // Taille du fichier en octets
        const fileType = selectedFile.type; // Type MIME du fichier
            
        // Tester si l'image est une image jpeg ou png et si elle peses + de 4mo
        if (fileType.startsWith("image/jpeg") || fileType.startsWith("image/png")) {
            if (fileSize > 4000000) {
                errorMessagePhoto.style.color = "red"
                errorMessagePhoto.innerText = "La taille du fichier ne doit pas excéder 4 mo"
                selectedFile = ""
                imagePreviewElement.innerHTML = ""
                imagePreviewElementIMG = ""
                imagePreviewElement.classList.add("hidden")
                insertFileElement.classList.remove("hidden")
                return
            } else {
                errorMessagePhoto.innerText = ""
                const fileReader = new FileReader();
                fileReader.onload = (e) => {
                    imagePreviewElement.innerHTML = ""
                    imagePreviewElementIMG = ""
                    imagePreviewElementIMG = document.createElement('img')
                    imagePreviewElementIMG.setAttribute("src", "")
                    imagePreviewElement.appendChild(imagePreviewElementIMG)
                    imagePreviewElementIMG.src = e.target.result; // Affectez la source de l'image à l'élément d'aperçu
                    imagePreviewElement.classList.remove("hidden")
                    insertFileElement.classList.add("hidden")
                }
            fileReader.readAsDataURL(selectedFile);
            }
        } else {
            errorMessagePhoto.style.color = "red"
            errorMessagePhoto.innerText = "Vous devez selectionner un fichier avec une extension .jpg ou .png"
            return
        }

    }
}

/**
 * Fonction pour activer le boputon de validation d'un nouveau projet
 * Vérifie que tous les champs sont remplis
 */
function formAddProjetCheck () {
    document.querySelector(".addPhotoValidate").disabled = true
    if (document.getElementById("image-preview").innerHTML) {
        let imageOK = true
        if (document.getElementById("titleNewPhoto").value) {
            let titleOK = true
            if (document.querySelector("select").value) {
                let categoryOK = true
                if (imageOK && titleOK && categoryOK) {
                    document.querySelector(".addPhotoValidate").disabled = false
                }
            }
        } 
    } 
}