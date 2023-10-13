
/**
 * Fonction Ouvrir une page modale
 * @param {*} modal Contenu de la page modale
 */
function openModal (modal) {
    
    document.querySelector(".modal-message").innerText = ""
    modal.classList.remove("hidden")
    modal.setAttribute("aria-hidden", false)
    modal.setAttribute("aria-modal", true)
    document.querySelector('body').classList.add('no-scroll') 
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
async function closeModal (modal) {
    if (modal === null) return
    photoGalleryElement.classList.remove("hidden")
    addPhotoGalleryElement.classList.add("hidden")
    document.querySelector(".fa-arrow-left").style.overflow = "auto"
    modal.classList.add("hidden")
    document.querySelector('body').classList.remove('no-scroll')
    modal.setAttribute("aria-hidden", true)
    modal.setAttribute("aria-modal", false)
    modal.removeEventListener("click", () => openModal(modal))
    getWorks ()
    showWorks(works)
    modal = null 
}

/**
 * Fonction : Empeche la propagation du clic de souris aux éléments enfants de la boîte modale (l'extérieur de la boîte)
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
 * Pour afficher les projets dans la page modale-main
 */
async function showGalleryFunction() {

    modalMain.classList.remove('hidden')
    modalMain.setAttribute("aria-modal", "true")
    document.querySelector('body').classList.add('no-scroll')
    // On récupère les projets via l'Api
    works = null
    works = await getWorks()
    const showGallery = document.querySelector(".showGallery")
    showGallery.innerHTML = ""
    for (let i=0; i < works.length; i++) { // Création des balises pour chaque projet
        const figureTag = document.createElement("figure")
        const imageElement = document.createElement("img")
        imageElement.src = works[i].imageUrl // ajout de l"url de l"image
        imageElement.alt = works[i].title // ajout de la balise Alt
        const trashIconLink = document.createElement("p")
        trashIconLink.classList.add("trash")
        const trashIcon = document.createElement("i")
        trashIconLink.setAttribute("data-id", works[i].id)
        trashIcon.classList.add("fa-regular")
        trashIcon.classList.add("fa-trash-can")
        trashIcon.innerHTML = ""
        trashIcon.addEventListener("click", (event) => handleTrashIconClick(event));
        trashIconLink.appendChild(trashIcon)
        figureTag.appendChild(imageElement) // Affichage les nouveaux elements
        figureTag.appendChild(trashIconLink) // Affichage de l'icon trash
        showGallery.appendChild(figureTag)
    }
}

/**
 * Fonction de gestionnaire pour le clic sur l'icône de poubelle
 * @param {*} event 
 */
function handleTrashIconClick(event) {
    modal = modalValidateDelete;
    openModal(modal);
    let deleteId = event.target.parentNode.dataset.id;
    modalWorkDelete(deleteId, modal);
}

/**
 * Fonction pour effacer un projet : Affiche la modale pour demander confirmation de la suppression
 * @param {workid} workid Id du projet a effacer
 * @param {*} modal contenu de la modale a afficher
 * @return
 */
async function modalWorkDelete(workid, modal) {
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
                showGalleryFunction()
            }
            if (answer.status === 401) { // Si autorisation refusée (token expiré)
                closeModal(modal)
                openModal(modalLogoutForced)
                document.getElementById("ok-logout").addEventListener("click", () => window.location.href = "./login.html") 
              }
            if (answer.status === 404 || answer.status === 500) { // si erreur coté serveur
                let deleteError = document.querySelector(".modal-message")
                deleteError.style.color = "red"
                deleteError.innerText = `Opération impossible - erreur ${answer.status}`
                throw new Error(`Opération impossible - erreur ${answer.status}`)
            }
        } catch (error) {
            console.log(error)
        }
    })
}


/**
 * Fonction pour poster un nouveau projet dans la db
 * @param {*} formulaire 
 * @returns 
 */
async function postNewWork (formulaire) {

    // On récupère les données du formulaire dans un objet "FormData"
    const formDataWork = new FormData(formulaire);

    // Nouvel objet FormData pour stocker uniquement les données demandées pour la base de donnée
    const newWorkData = new FormData();
    newWorkData.append('image', formDataWork.get('file-upload'));
    newWorkData.append('title', formDataWork.get('title'));
    newWorkData.append('category', formDataWork.get("category"));

    try {
        let answer = await fetch("http://localhost:" + apiPort + "/api/works/", { 
            method: "POST",
            headers: { "Authorization": "Bearer " + JSON.parse(window.sessionStorage.getItem("token")) },
            body:  newWorkData
        }) 
        if (answer.ok) { // réponse positive du serveur, on revient sur la modale des projets.
            closeModal(modalMain)
            document.getElementById("arrow").click()
            let addProjectOk = document.querySelector(".modal-message")
            addProjectOk.style.color = "#1D6154"
            addProjectOk.innerText = "Photo ajoutée avec succès" // Message de succès
            addProjectOk.classList.add()
            return
        }
        if (answer.status === 401) { // Si autorisation refusée (token expiré)
            closeModal(modal)
            openModal(modalLogoutForced)
            document.getElementById("ok-logout").addEventListener("click", () => window.location.href = "./login.html") 
          }
        if (answer.status === 404 || answer.status === 500) { // Message si erreur coté serveur 
            let addProjectError = document.querySelector(".modal-message")
            addProjectError.style.color = "red"
            addProjectError.innerText = `Opération impossible - erreur ${answer.status}`
            throw new Error(`Opération impossible - erreur ${answer.status}`)
        }
    } catch (error) {
        console.log(error)
    }
}

/**
 * Fonction pour charger une image et la vérifier
 * @param {*} event 
 * @param {*} insertFileElement 
 * @returns 
 */
function addPhotoFunction (event, insertFileElement) {
    let errorMessagePhoto = document.querySelector(".modal-message")
    let selectedFile = event.target.files[0]; // Le fichier sélectionné par l'utilisateur
    let imagePreviewElement = document.getElementById("image-preview")
    let imagePreviewElementIMG = ""

    if (selectedFile) {
        // Accéder aux propriétés du fichier :
        const fileSize = selectedFile.size; // Taille du fichier en octets
        const fileType = selectedFile.type; // Type MIME du fichier
            
        // Tester si l'image est une image jpeg ou png et si elle peses + de 4mo
        if (fileType.startsWith("image/jpeg") || fileType.startsWith("image/png")) {
            if (fileSize > 4000000) {
                document.querySelector(".addPhotoValidate").disabled = true
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
                    imagePreviewElementIMG.src = e.target.result; // Affectez la source de l'image à l'élément HTML d'aperçu
                    imagePreviewElement.classList.remove("hidden")
                    insertFileElement.classList.add("hidden")
                }
            fileReader.readAsDataURL(selectedFile);
            }
        } else {
            document.querySelector(".addPhotoValidate").disabled = true
            errorMessagePhoto.style.color = "red"
            errorMessagePhoto.innerText = "Vous devez selectionner un fichier avec une extension .jpg, .jpeg ou .png"
            imagePreviewElement.innerHTML = ""
            imagePreviewElementIMG = ""
            imagePreviewElement.classList.add("hidden")
            insertFileElement.classList.remove("hidden")
            return
        }
    }
}

/**
 * Fonction pour activer le bouton de validation d'un nouveau projet
 * Vérifie que tous les champs sont remplis
 */
function formAddProjetCheck () {
    document.querySelector(".addPhotoValidate").disabled = true
    if (document.getElementById("file-upload").value) {
        if (document.getElementById("titleNewPhoto").value) {
            if (document.querySelector("select").value) {
                if(document.querySelector(".modal-message").innerText === "") {
                    document.querySelector(".addPhotoValidate").disabled = false
                }
            }
        } 
    } 
}