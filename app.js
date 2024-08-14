document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("login-btn");
    const registerBtn = document.getElementById("register-btn");
    const formWrapper = document.querySelector(".form-wrapper");
    const formBtns = document.querySelector(".form-btns");
    const buttons = document.querySelectorAll(".form-btns button");

    function updateActiveButton(activeButton) {
        buttons.forEach(button => button.classList.remove("active"));
        activeButton.classList.add("active");
        const buttonWidth = activeButton.offsetWidth;
        const buttonLeft = activeButton.offsetLeft;
        formBtns.style.setProperty('--underline-width', `${buttonWidth}px`);
        formBtns.style.setProperty('--underline-left', `${buttonLeft}px`);
    }

    loginBtn?.addEventListener("click", function () {
        formWrapper.style.transform = "translateX(0)";
        updateActiveButton(loginBtn);
    });

    registerBtn?.addEventListener("click", function () {
        formWrapper.style.transform = "translateX(-50%)";
        updateActiveButton(registerBtn);
    });

    loginBtn?.click();

    document.getElementById('register-form')?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const messageElem = document.getElementById('message');

        try {
            const response = await fetch('http://localhost:7777/api/auth/signup', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            const result = await response.json();
            console.log('Signup response:', result);

            if (response.ok) {
                messageElem.textContent = 'Succesvol geregistreerd!';
                messageElem.style.color = 'green';
                console.log('User ID:', result._id);

                loginBtn?.click();

                document.getElementById('register-form').reset();
            } else {
                messageElem.textContent = result.error || 'Registratie mislukt!';
                messageElem.style.color = 'red';
            }
        } catch (error) {
            messageElem.textContent = 'Error: ' + error.message;
            messageElem.style.color = 'red';
        }
    });

    document.getElementById('login-form')?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = document.getElementById('loginName').value;
        const password = document.getElementById('loginPassword').value;
        const messageElem = document.getElementById('loginMessage');

        try {
            const response = await fetch('http://localhost:7777/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    password
                })
            });

            const result = await response.json();

            if (response.ok) {
                messageElem.textContent = 'Succesvol ingelogd!';
                messageElem.style.color = 'green';
                window.location.pathname = 'index.html';

                localStorage.setItem('userId', result._id);
                const firstLetter = result.name.charAt(0).toUpperCase();
                localStorage.setItem('firstLetter', firstLetter);

                updateAccountInfo(firstLetter);

                document.getElementById('login-form').reset();
            } else {
                messageElem.textContent = result.error || 'Niet kunnen inloggen';
                messageElem.style.color = 'red';
            }
        } catch (error) {
            messageElem.textContent = 'Error: ' + error.message;
            messageElem.style.color = 'red';
        }
    });

    async function fetchUserData() {
        const userId = localStorage.getItem('userId');
        if (userId) {
            try {
                const response = await fetch(`http://localhost:7777/api/auth/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
    
                const user = await response.json();
                if (response.ok && user.name) {
                    const firstLetter = user.name.charAt(0).toUpperCase();
                    localStorage.setItem('firstLetter', firstLetter);
                    updateAccountInfo(firstLetter);
                } else {
                    console.log('User not found or unable to fetch user details');
                    setDefaultAccountLink();
                }
            } catch (error) {
                console.log('Error fetching user details:', error.message);
                setDefaultAccountLink();
            }
        } else {
            setDefaultAccountLink();
        }
    }
    
    function updateAccountInfo(firstLetter) {
        const accountElems = document.querySelectorAll(".account");
        if (accountElems) {
            accountElems.forEach((item) => {
                item.innerHTML = `<div class='profile'>${firstLetter} <div class='logOut logOutBtn'><button class='logOutBtn'>Uitloggen <i class="fa-solid fa-right-from-bracket logOutBtn"></i></button></div></div>`;
            });

            const logOutBtns = document.querySelectorAll(".logOutBtn");
            logOutBtns.forEach((btn) => {
                btn.addEventListener("click", async () => {
                    try {
                        const logoutResponse = await fetch('http://localhost:7777/api/auth/logout', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });

                        if (logoutResponse.ok) {
                            localStorage.removeItem('userId');
                            localStorage.removeItem('firstLetter');
                            setDefaultAccountLink();
                            console.log('Logout successful');
                        } else {
                            console.log('Logout failed');
                        }
                    } catch (error) {
                        console.log('Error during logout:', error.message);
                    }
                });
            });
        }
    }

    function setDefaultAccountLink() {
        const accountElem = document.querySelectorAll(".account");
        if (accountElem) {
            accountElem.forEach((item) => {
                item.innerHTML = `<a href='account.html'>Account</a>`;
            });
        }
    }

    fetchUserData();
});