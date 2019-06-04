document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Cargado.");

    const password = document.getElementById('password');
    const passwordConfirm = document.getElementById('passwordConfirm');

    let submitRegisterBtn = document.getElementById('submitRegister');

    submitRegisterBtn.disabled = true;

    password.addEventListener("keyup", (event) => {
        let password1 = password.value;
        let password2 = passwordConfirm.value;

        let passwordWarning = document.getElementById('passwordWarning');


        if (password1 === password2) {
            passwordWarning.style.display = "none";

            submitRegisterBtn.disabled = false;
        } else {
            passwordWarning.style.display = "block";

            submitRegisterBtn.disabled = true;
        }
    });

    passwordConfirm.addEventListener("keyup", (event) => {
        let password1 = password.value;
        let password2 = passwordConfirm.value;

        let passwordWarning = document.getElementById('passwordWarning');


        if (password1 === password2) {
            passwordWarning.style.display = "none";

            submitRegisterBtn.disabled = false;
        } else {
            passwordWarning.style.display = "block";

            submitRegisterBtn.disabled = true;
        }
    });
});