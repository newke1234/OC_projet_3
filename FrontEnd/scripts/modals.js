/**
 * Fonction Ouvrir une page modale
 * @param {*} modal Contenu de la page modale
 */
function openModal(modal) {
    document.querySelector(".modal-message").innerText = "";
    modal.classList.remove("hidden");
    document.querySelector('body').classList.add('no-scroll');
    switch (modal.id) {
        case 'modal-logout':
            logout();
            break;

        case 'modal-main':
            showGalleryFunction();
            break;

        default:
            break;
    }
    if (modal.id !== "modal-logout-forced") {
        modal.addEventListener("click", () => closeModal(modal));
    }

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
async function closeModal(modal) {
    if (modal === null) return;
    photoGalleryElement.classList.remove("hidden");
    addPhotoGalleryElement.classList.add("hidden");
    document.querySelector(".fa-arrow-left").style.overflow = "auto";
    modal.classList.add("hidden");
    document.querySelector('body').classList.remove('no-scroll');
    modal.removeEventListener("click", () => openModal(modal));
    getWorks();
    showWorks(works);
    modal = null;
}

/**
 * Fonction : Empeche la propagation du clic de souris aux éléments enfants de la boîte modale (l'extérieur de la boîte)
 * @param {*} event
 */
const stopPropagation = function (event) {
    event.stopPropagation();
}

function logout() {
    const answerLogoutButtons = document.getElementById("yes-button-logout");
    answerLogoutButtons.addEventListener("click", () => {
        window.sessionStorage.removeItem("token");
        window.location.href = "./index.html";
    });
}

/**
 * Pour afficher les projets dans la page modale-main
 */
async function showGalleryFunction() {
    modalMain.classList.remove('hidden');
    document.querySelector('body').classList.add('no-scroll');
    // On récupère les projets via l'Api
    works = null;
    works = await getWorks();
    showWorks(works); // on met à jour les projets sur la page d'accueil
    const showGallery = document.querySelector(".showGallery");
    showGallery.innerHTML = "";

    for (let i = 0; i < works.length; i++) {
        // Création des balises pour chaque projet
        const figureTag = document.createElement("figure");
        const imageElement = document.createElement("img");
        // ajout de l"url de l"image / L'url doit être adaptée au port utilisé, car la port 5678 est utilisé par défaut dans l'url de la base de donnée.
        imageElement.src = works[i].imageUrl.replace(/localhost:[0-9]+/,`localhost:${apiPort}`);
        imageElement.alt = works[i].title;
        const trashIconLink = document.createElement("p");
        trashIconLink.classList.add("trash");
        const trashIcon = document.createElement("i");
        trashIconLink.setAttribute("data-id", works[i].id);
        trashIcon.classList.add("fa-regular");
        trashIcon.classList.add("fa-trash-can");
        trashIcon.innerHTML = "";
        trashIcon.addEventListener("click", (event) => {
            event.preventDefault();
            handleTrashIconClick(event);
        });
        trashIconLink.appendChild(trashIcon);
        figureTag.appendChild(imageElement);
        figureTag.appendChild(trashIconLink);
        showGallery.appendChild(figureTag);
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
    workDelete(deleteId, modal);
}

/**
 * Fonction pour effacer un projet : Affiche la modale pour demander confirmation de la suppression
 * @param {workid} workid Id du projet a effacer
 * @param {*} modal contenu de la modale a afficher
 * @return
 */
async function workDelete(workid, modal) {
    const answerWorkDeleteButtons = document.getElementById("yes-button-delete");
    answerWorkDeleteButtons.addEventListener('click', async () => {
        try {
            let answer = await fetch("http://localhost:" + apiPort + "/api/works/" + workid, { 
                method: "DELETE",
                headers: { "Authorization": "Bearer " + JSON.parse(window.sessionStorage.getItem("token"))}
            });
            if (answer.ok) {
                closeModal(modal);
                let deleteOk = document.querySelector(".modal-message");
                deleteOk.style.color = "#1D6154";
                deleteOk.innerText = "Projet supprimé avec succès";
                
                showGalleryFunction();
            }
            if (answer.status === 401) { // Si autorisation refusée (token expiré)
                closeModal(modal);
                openModal(modalLogoutForced);
                document.getElementById("ok-logout").addEventListener("click", () => window.location.href = "./login.html");
            }
            if (answer.status === 404 || answer.status === 500) { // si erreur coté serveur
                let deleteError = document.querySelector(".modal-message");
                deleteError.style.color = "red";
                deleteError.innerText = `Opération impossible - erreur ${answer.status}`;
                throw new Error(`Opération impossible - erreur ${answer.status}`);
            }
        } catch (error) {
            console.log(error);
        }
    });
}

/**
 * Fonction pour charger une image et la vérifier
 * @param {*} event 
 * @param {*} insertFileElement 
 * @returns 
 */
function addPhotoFunction(event, insertFileElement) {
    let errorMessagePhoto = document.querySelector(".modal-message");
    let selectedFile = event.target.files[0]; // Le fichier sélectionné par l'utilisateur
    let imagePreviewElement = document.getElementById("image-preview");
    let imagePreviewElementIMG = "";

    if (selectedFile) {
        // Accéder aux propriétés du fichier :
        const fileSize = selectedFile.size; // Taille du fichier en octets
        const fileType = selectedFile.type; // Type MIME du fichier;
            
        // Tester si l'image est une image jpeg ou png et si elle peses + de 4mo
        if (fileType.startsWith("image/jpeg") || fileType.startsWith("image/png")) {
            if (fileSize > 4000000) {
                document.querySelector(".addPhotoValidate").disabled = true;
                errorMessagePhoto.style.color = "red";
                errorMessagePhoto.innerText = "La taille du fichier ne doit pas excéder 4 Mo";
                selectedFile = "";
                imagePreviewElement.innerHTML = "";
                imagePreviewElementIMG = "";
                imagePreviewElement.classList.add("hidden");
                insertFileElement.classList.remove("hidden");
                return;
            } else {
                errorMessagePhoto.innerText = "";
                const fileReader = new FileReader();
                fileReader.onload = (e) => {
                    imagePreviewElement.innerHTML = "";
                    imagePreviewElementIMG = "";
                    imagePreviewElementIMG = document.createElement('img');
                    imagePreviewElementIMG.setAttribute("src", "");
                    imagePreviewElement.appendChild(imagePreviewElementIMG);
                    imagePreviewElementIMG.src = e.target.result; // Affectez la source de l'image à l'élément HTML d'aperçu;
                    imagePreviewElement.classList.remove("hidden");
                    insertFileElement.classList.add("hidden");
                };
            fileReader.readAsDataURL(selectedFile);
            }
        } else {
            document.querySelector(".addPhotoValidate").disabled = true;
            errorMessagePhoto.style.color = "red";
            errorMessagePhoto.innerText = "Vous devez selectionner un fichier avec une extension .jpg, .jpeg ou .png";
            imagePreviewElement.innerHTML = "";
            imagePreviewElementIMG = "";
            imagePreviewElement.classList.add("hidden");
            insertFileElement.classList.remove("hidden");
            return;
        }
    }
}

/**
 * Fonction pour poster un nouveau projet dans la db
 * @returns 
 */
async function postNewWork() {
    // On récupère les données du formulaire dans un objet "FormData";
    let formDataWork = new FormData();
    formDataWork.append('image', document.getElementById("file-upload").files[0]);
    formDataWork.append('title', document.getElementById("title").value);
    formDataWork.append('category', document.querySelector("select").value);

    try {
        let answer = await fetch("http://localhost:" + apiPort + "/api/works/", { 
            method: "POST",
            headers: { "Authorization": "Bearer " + JSON.parse(window.sessionStorage.getItem("token")) },
            body: formDataWork
        });
        if (answer.ok) { // réponse positive du serveur, on revient sur la modale des projets.
            closeModal(modalMain);
            document.getElementById("arrow").click();
            let addProjectOk = document.querySelector(".modal-message");
            addProjectOk.style.color = "#1D6154";
            addProjectOk.innerText = "Photo ajoutée avec succès"; // Message de succès
            addProjectOk.classList.add();
            return;
        }
        if (answer.status === 401) { // Si autorisation refusée (token expiré)
            closeModal(modal);
            openModal(modalLogoutForced);
            document.getElementById("ok-logout").addEventListener("click", () => window.location.href = "./login.html");
        }
        if (answer.status === 404 || answer.status === 500 || answer.status === 400) { // Message si erreur coté serveur;
            let addProjectError = document.querySelector(".modal-message");
            addProjectError.style.color = "red";
            addProjectError.innerText = `Opération impossible - erreur ${answer.status}`;
            throw new Error(`Opération impossible - erreur ${answer.status}`);
        }
    } catch (error) {
        console.log(error);
    }
}

/**
 * Fonction pour activer le bouton de validation d'un nouveau projet;
 * Vérifie que tous les champs sont remplis;
 */
function formAddProjetCheck() {
    document.querySelector(".addPhotoValidate").disabled = true;
    if (document.getElementById("file-upload").value) {
        if (document.getElementById("title").value) {
            if (document.querySelector("select").value) {
                if (document.querySelector(".modal-message").innerText === "") {
                    document.querySelector(".addPhotoValidate").disabled = false;
                }
            }
        }
    }
}
