// Récupération des projets du site depuis l"API
let works = await fetch("http://localhost:" + apiPort + "/api/works").then(works => works.json())

// recupération des catégories
let categories = await fetch("http://localhost:" + apiPort + "/api/categories").then(categories => categories.json())
let categoriesSet = new Set(categories) // Set pour éviter les doublons
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
    a.addEventListener('click', async (event) => {
        modal = document.querySelector(event.target.getAttribute('href'))
        openModal(modal)
        document.querySelector(".fa-arrow-left").classList.add("hidden")
        // await showGalleryFunction()
        // const trashIconElements = document.querySelectorAll('.trash')
        // trashIconElements.forEach (p => {
        //     p.addEventListener("click", (event) => handleTrashIconClick(event));
        // })
    })  
})

function resetFileInput(inputElement) {
    const cloneInput = inputElement.cloneNode(true);
    inputElement.parentNode.replaceChild(cloneInput, inputElement);
    return cloneInput;
  }

// Listener "Ajouter Photo"
document.querySelector('.addPhotoButton').addEventListener('click', async () => {
    photoGalleryElement.classList.add("hidden")
    addPhotoGalleryElement.classList.remove("hidden")
    document.querySelector(".fa-arrow-left").classList.remove("hidden")
 
    const photoUploadElement = document.getElementById("file-upload")
    photoUploadElement.value = null;
  
    // const insertFileElement = document.getElementById("insertFile")
    // const imagePreviewElementDiv = document.getElementById("image-preview")


    insertFileElement.classList.remove("hidden")
    document.getElementById("image-preview").classList.add("hidden")
    document.getElementById("image-preview").innerText = ""
    document.querySelector(".modal-message").classList.remove("hidden")
    // Creation du menu déroulant pour les catégories disponibles
    const selectTag = document.querySelector('select')
    selectTag.innerHTML = "<option value='' default></option>"
    document.getElementById("titleNewPhoto").value = ""
    categories = await fetch("http://localhost:" + apiPort + "/api/categories").then(categories => categories.json())
    categoriesSet = new Set(categories) // Set pour éviter les doublons
    categoriesSet.forEach(item => { 
        let selectOption = document.createElement('option')
        selectOption.setAttribute("value", item.id)
        selectOption.innerText = item.name
        selectTag.appendChild(selectOption)
    })
})

    // Listener bouton Upload image
const photoUploadElement = document.getElementById("file-upload")
const insertFileElement = document.getElementById("insertFile")
const imagePreviewElementDiv = document.getElementById("image-preview")
insertFileElement.addEventListener('click', () => { 
    photoUploadElement.value = null;
    photoUploadElement.click()
    photoUploadElement.addEventListener('change', (event) => {
        addPhotoFunction (event, insertFileElement)
    })
});

// Listener bouton Upload image quand une image est déjà chargée et affichée
imagePreviewElementDiv.addEventListener('click', () => { 
    photoUploadElement.value = null;
    photoUploadElement.click()
    photoUploadElement.addEventListener('change', (event) => {
        addPhotoFunction (event, insertFileElement)
    })
});




// Envoi de "Ajout de projet" par bouton valider
    // On vérifie que tous les champs sont actifs pour activer le bouton submit
document.querySelector("select").addEventListener("change", () => formAddProjetCheck())
document.getElementById("titleNewPhoto").addEventListener("input", () => formAddProjetCheck())
photoUploadElement.addEventListener("change", () => {

 formAddProjetCheck()
})


// Listener Fleche 
document.getElementById('arrow').addEventListener('click', () => {
    photoGalleryElement.classList.remove("hidden")
    addPhotoGalleryElement.classList.add("hidden")
    document.querySelector(".modal-message").innerText = ""
    document.querySelector(".modal-message").classList.add("hidden")
    document.querySelector(".fa-arrow-left").classList.add("hidden")
    // observer.disconnect();
    showGalleryFunction()
    // document.querySelector(".button-modifier").click()
})



// Listener bouton "Valider" pour method POST des infos du nouveau projet
const formulaire = document.getElementById("modifyGallery")
formulaire.addEventListener('submit', function (event) {
    event.preventDefault(); 
    postNewWork(formulaire)
});