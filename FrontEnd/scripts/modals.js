





modalLogout = function () {
    const answerLogoutButtons = document.querySelectorAll('.modal-logout div button')
    for (let i=0; i < answerLogoutAnswerButtons.length; i++) {
        answerLogoutButtons[i].addEventListener('click', (event) => {
            popupLogout.setAttribute("aria-modal", "false")
            if (event.target.dataset.answer === "yes") {
                window.sessionStorage.removeItem("token")
                window.location.href = "./index.html"
            // } else {
            //     popupLogout.classList.add('hidden')
            //     document.querySelector('body').classList.remove('no-scroll')
            //     return
            }
        })
    }
}
