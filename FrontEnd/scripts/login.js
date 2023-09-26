

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
        let answer = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: userData
        })
        if (answer.status === 404 || answer.status === 401) {
           throw new Error('Email/Mot de passe incorrects') 
        }
        // on recupère le token et on le stock dans le sessionStorage
        // CODE window.sessionStorage ici
        window.location.href = "./index.html"   // On retourne vers la page d'accueil
    } catch (error) {
        // Sécurité ? On ne doit pas montrer dans la base de donnée que l'utilisateur n'est pas dans la base de donnée.
        console.clear()
        errorMessage.innerText = error        
    }
})

// si reponse du serveur = 200, on connecte l'utilisateur

// sinon, on met message non valide



