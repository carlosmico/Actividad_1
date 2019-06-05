document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Cargado.");

    passwordMatch();
    recoveryPasswordMatch();
});

const passwordMatch = () => {
    const password = document.getElementById('password');
    const passwordConfirm = document.getElementById('passwordConfirm');
    const submitRegisterBtn = document.getElementById('submitRegister');

    if (password) {
        submitRegisterBtn.disabled = true;

        const logic = () => {
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
        }

        password.addEventListener("keyup", (event) => {
            logic();
        });

        passwordConfirm.addEventListener("keyup", (event) => {
            logic();
        });
    }
}

const recoveryPasswordMatch = () => {
    const newPassword = document.getElementById('newPassword');
    const newPasswordConfirm = document.getElementById('newPasswordConfirm');
    const passwordSubmitRecovery = document.getElementById('passwordSubmitRecovery');

    if (passwordSubmitRecovery) {
        passwordSubmitRecovery.disabled = true;

        const logic = () => {
            let password1 = newPassword.value;
            let password2 = newPasswordConfirm.value;

            let passwordWarning = document.getElementById('recoveryWarning');

            if (password1 === password2) {
                passwordWarning.style.display = "none";

                passwordSubmitRecovery.disabled = false;
            } else {
                passwordWarning.style.display = "block";

                passwordSubmitRecovery.disabled = true;

                passwordSubmitRecovery.addEventListener("submit", (event) => {
                    event.preventDefault();

                    console.log("soy el nuevo boton de recovery!!");
                });
            }
        }

        newPassword.addEventListener("keyup", (event) => {
            logic();
        });

        newPasswordConfirm.addEventListener("keyup", (event) => {
            logic();
        });
    }
}