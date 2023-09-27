// import { showWorks, showFilterButtons } from "./works.js"

// verifier si un utilisateur est loggué
let tokenSession = JSON.parse(window.sessionStorage.getItem("token"))
// tokenSession = ("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4") // je suis loggué
if (tokenSession) {
    console.log(tokenSession)
    const menuLogout = document.querySelector(".menu-logout")
    const menuLogin = document.querySelector(".menu-login")
    menuLogout.classList.remove("hidden")
    menuLogin.classList.add("hidden")
}

// Récupération des projets du site depuis l"API
let works = await fetch("http://localhost:" + apiPort + "/api/works").then(works => works.json())
let categories = await fetch("http://localhost:" + apiPort + "/api/categories").then(categories => categories.json())

let categoriesSet = new Set(categories) // Set pour éviter les doublons
let worksFiltered = works // Tableau des projets filtrée, ici : liste complète par défaut

showFilterButtons(categoriesSet)
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

// Listener bouton logout
const menuLogout = document.querySelector('.menu-logout')
menuLogout.addEventListener('click', () => {
    const popupLogout = document.querySelector('.popup-logout')
    popupLogout.classList.remove('hidden')
    const answerLogoutAnswerButtons = document.querySelectorAll('.popup-logout div button')
    for (let i=0; i < answerLogoutAnswerButtons.length; i++) {
        answerLogoutAnswerButtons[i].addEventListener('click', (event) => {
            console.log(event)
            if (event.target.dataset.answer === "yes") {
                window.sessionStorage.removeItem("token")
                window.location.href = "./index.html"
            } else {
                popupLogout.classList.add('hidden')
                return
            }
        })
    }
})
