// On vide le sessionStorage
window.sessionStorage.removeItem("token")

// on ecoute le bouton 'se connecter'
const loginSubmit = document.getElementById("loginSubmit")
loginSubmit.addEventListener('click', async () => {

    // on recupere les données du formulaire
    const inputEmail = document.getElementById("email").value
    const inputPassword = document.getElementById("password").value
    // on prépare la balise pour les messages d'erreur
    const errorMessage = document.querySelector('.errorMessage')
    // on vérifie que les saisies sont correctes
    let emailRegExp = new RegExp("[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\\.[a-zA-Z0-9._-]+")
       
    if (!emailRegExp.test(inputEmail)) {  // test de l'email 
        errorMessage.innerText = 'Erreur : Veuillez entrer une adresse email valide'
        return
    }
    if (!inputPassword) {  // test si password est vide
        errorMessage.innerText = 'Erreur : Veuillez entrer un mot de passe'
        return
    }
    // preparation des données a envoyer (userDATA) 
    let userData = {
        email: inputEmail,
        password: inputPassword
    }
    userData = JSON.stringify(userData)
    // Envoyer requete POST avec les données userData
    try {
        let answer = await fetch("http://localhost:" + apiPort + "/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: userData
        })
        if (answer.status === 404 || answer.status === 401) {
           throw new Error('Email/Mot de passe non autorisés') 
        }
        // on recupère le token et on le stock dans le sessionStorage
        let result = await answer.json()
        window.sessionStorage.setItem("token", JSON.stringify(result.token))
        console.log(window.sessionStorage.getItem("token"))
        window.location.href = "./index.html"  // On retourne vers la page d'accueil
          
    } catch (error) {
        // Sécurité ? On ne doit pas montrer que l'utilisateur est dans la base de donnée.
        // console.clear()
        errorMessage.innerText = error        
    }
})



