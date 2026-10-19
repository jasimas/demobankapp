document.addEventListener("DOMContentLoaded", () => {

    const loginButton =
        document.getElementById("loginButton");

    const usernameInput =
        document.getElementById("username");

    const passwordInput =
        document.getElementById("password");

    const loginMessage =
        document.getElementById("loginMessage");


    loginButton.addEventListener("click", async () => {

        const username =
            usernameInput.value.trim();

        const password =
            passwordInput.value;


        // -----------------------------
        // CLIENT SIDE VALIDATION
        // -----------------------------

        if (!username) {

            loginMessage.textContent =
                "Please enter username.";

            loginMessage.style.color = "red";

            return;
        }


        if (!password) {

            loginMessage.textContent =
                "Please enter password.";

            loginMessage.style.color = "red";

            return;
        }


        loginMessage.textContent =
            "Logging in...";

        loginMessage.style.color = "#0879d1";


        console.log("Calling login API...");
        console.log("Username:", username);


        try {

            // -----------------------------
            // CALL BACKEND API
            // -----------------------------

            const response = await fetch(
                "http://localhost:3000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                }
            );


            console.log(
                "API status:",
                response.status
            );


            const data =
                await response.json();


            console.log(
                "API response:",
                data
            );


            // -----------------------------
            // INVALID LOGIN
            // -----------------------------

            if (!response.ok || !data.success) {

                loginMessage.textContent =
                    data.message ||
                    "Invalid username or password.";

                loginMessage.style.color = "red";

                return;
            }


            // -----------------------------
            // SUCCESS
            // -----------------------------

            loginMessage.textContent =
                "Login successful!";

            loginMessage.style.color =
                "green";


            // Store logged-in user

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            console.log(
                "Logged in user:",
                data.user
            );


            // Redirect

            setTimeout(() => {

                window.location.href =
                    "Dashboard.html";

            }, 500);


        } catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );


            loginMessage.textContent =
                "Unable to connect to server. Is the backend running?";

            loginMessage.style.color =
                "red";
        }

    });

});