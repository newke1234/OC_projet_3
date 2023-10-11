// Variable globale pour le port de l'API
const apiPort = "5678"

// Varibale pour les modales

const modalLogout = document.getElementById('modal-logout')
const modalMain = document.getElementById('modal-main')
const modalValidateDelete = document.getElementById('modal-validateDelete')
const modalLogoutForced = document.getElementById('modal-logout-forced')
const photoGalleryElement = document.querySelector(".photoGallery")
const addPhotoGalleryElement = document.querySelector(".addPhotoGallery")
const showGallery = document.querySelector(".showGallery")

/*


// Sélectionnez l'élément que vous souhaitez observer
const targetElement = document.getElementById('image-preview');

// Créez une fonction de rappel à exécuter lorsque le contenu change
const callback = function(mutationsList, observer) {
    // Parcourez les mutations (changements)
    for (let mutation of mutationsList) {
        // Vérifiez si le type de mutation est une modification de nœud (caractère ou attribut)
        if (mutation.type === 'childList') {
            // Le contenu de l'élément a changé, vous pouvez réagir en conséquence ici
            formAddProjetCheck()
        }
    }
}

const observer = new MutationObserver(callback); // Créez un observateur avec la fonction de rappel
const config = { childList: true, subtree: true };// Configurez les options de l'observateur pour observer les modifications de contenu
observer.observe(targetElement, config); // Attachez l'observateur à l'élément cible et commencez à observer

// Pour arrêter d'observer plus tard, vous pouvez utiliser :
// observer.disconnect();
*/
