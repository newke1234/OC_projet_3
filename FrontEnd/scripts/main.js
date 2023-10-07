// Récupération des projets du site depuis l"API
let works = await fetch("http://localhost:" + apiPort + "/api/works").then(works => works.json())

// recupération des catégories
const categories = await fetch("http://localhost:" + apiPort + "/api/categories").then(categories => categories.json())
const categoriesSet = new Set(categories) // Set pour éviter les doublons

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
    console.log(modalMain)
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

// Listener bouton Uplod image
const photoUploadElement = document.getElementById("file-upload")
const insertFileElement = document.getElementById("insertFile")
insertFileElement.addEventListener('click', (event) => { 
    // event.preventDefault()
    photoUploadElement.click()})
    photoUploadElement.addEventListener('change', (event) => {
        const selectedFile = event.target.files[0]; // Le fichier sélectionné par l'utilisateur
        if (selectedFile) {
            // Vous pouvez maintenant accéder aux propriétés du fichier, par exemple :
            const fileName = selectedFile.name; // Nom du fichier
            const fileSize = selectedFile.size; // Taille du fichier en octets
            const fileType = selectedFile.type; // Type MIME du fichier (par exemple, image/jpeg)
            console.log(fileType)
    
            // Vous pouvez également prévisualiser l'image si elle est une image (par exemple, pour afficher une miniature)
            if (fileType.startsWith("image/")) {
                const fileReader = new FileReader();
                fileReader.onload = (e) => {
                    insertFileElement.innerHTML = ""
                    let insertFileElementIMG = document.createElement('img')
                    insertFileElement.appendChild(insertFileElementIMG)
                    insertFileElementIMG.setAttribute("src", "")
                    const imagePreview = insertFileElementIMG; 
                    console.log(imagePreview)
                    imagePreview.src = e.target.result; // Affectez la source de l'image à l'élément d'aperçu
                };
                fileReader.readAsDataURL(selectedFile);
            }
    
            // Vous pouvez maintenant traiter le fichier comme vous le souhaitez (par exemple, l'envoyer au serveur).
        }
    });
