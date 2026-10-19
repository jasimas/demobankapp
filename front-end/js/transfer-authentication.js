// =====================================================
// GET USER
// =====================================================

const user =
    JSON.parse(
        localStorage.getItem("user")
    );


if (!user) {

    window.location.href =
        "login.html";

}


// =====================================================
// GET TRANSFER
// =====================================================

const pendingTransfer =
    JSON.parse(
        sessionStorage.getItem(
            "pendingTransfer"
        )
    );


if (!pendingTransfer) {

    alert(
        "No transfer details found."
    );

    window.location.href =
        "transfer.html";

}


// =====================================================
// USER
// =====================================================

const welcomeUser =
    document.getElementById(
        "welcomeUser"
    );


if (welcomeUser) {

    welcomeUser.textContent =
        `Welcome, ${user.fullName || user.username}`;

}


// =====================================================
// DISPLAY TRANSFER
// =====================================================

document.getElementById(
    "authAmount"
).textContent =
    `AED ${Number(
        pendingTransfer.amount
    ).toFixed(2)}`;


document.getElementById(
    "authBeneficiary"
).textContent =
    pendingTransfer.beneficiary_name || "-";


// =====================================================
// ELEMENTS
// =====================================================

const otpInput =
    document.getElementById("otp");

const verifyButton =
    document.getElementById("verifyOtp");

const authenticationMessage =
    document.getElementById(
        "authenticationMessage"
    );

const attemptMessage =
    document.getElementById(
        "attemptMessage"
    );

const resendButton =
    document.getElementById(
        "resendOtp"
    );

const resendTimer =
    document.getElementById(
        "resendTimer"
    );


// =====================================================
// PRACTICE OTP
// =====================================================

const PRACTICE_OTP = "123456";

let attemptsRemaining = 3;

let resendSeconds = 30;


// =====================================================
// OTP INPUT
// =====================================================

otpInput.addEventListener(
    "input",
    function () {

        this.value =
            this.value.replace(
                /[^0-9]/g,
                ""
            );

    }
);


// =====================================================
// VERIFY OTP
// =====================================================

verifyButton.addEventListener(
    "click",
    async function () {

        const otp =
            otpInput.value.trim();


        authenticationMessage.textContent =
            "";


        if (!otp) {

            showError(
                "Please enter the OTP."
            );

            return;

        }


        if (otp.length !== 6) {

            showError(
                "OTP must contain 6 digits."
            );

            return;

        }


        // ---------------------------------------------
        // INVALID OTP
        // ---------------------------------------------

        if (otp !== PRACTICE_OTP) {

            attemptsRemaining--;


            attemptMessage.textContent =
                `Attempts remaining: ${attemptsRemaining}`;


            showError(
                "Invalid OTP. Please try again."
            );


            if (attemptsRemaining <= 0) {

                verifyButton.disabled =
                    true;

                otpInput.disabled =
                    true;

                showError(
                    "Authentication failed. Maximum attempts exceeded."
                );

            }


            return;

        }


        // ---------------------------------------------
        // VALID OTP
        // ---------------------------------------------

        verifyButton.disabled =
            true;

        verifyButton.textContent =
            "Processing...";


        try {

            const response =
                await fetch(
                    "http://localhost:3000/api/transfers",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body: JSON.stringify({

                            user_id:
                                user.id,

                            account_id:
                                pendingTransfer.account_id,

                            beneficiary_id:
                                pendingTransfer.beneficiary_id,

                            amount:
                                pendingTransfer.amount,

                            currency:
                                "AED",

                            purpose:
                                pendingTransfer.purpose,

                            transaction_type:
                                "TRANSFER",

                            authentication_status:
                                "VERIFIED"

                        })

                    }
                );


            const data =
                await response.json();


            if (!response.ok ||
                !data.success) {

                throw new Error(
                    data.message ||
                    "Transfer failed"
                );

            }


            // Save completed transaction
            sessionStorage.setItem(
                "completedTransfer",
                JSON.stringify(
                    data.transaction
                )
            );


            // Clear pending transfer
            sessionStorage.removeItem(
                "pendingTransfer"
            );


            // Go to success page
            window.location.href =
                "transfer-success.html";


        } catch (error) {

            console.error(
                "Transfer error:",
                error
            );


            showError(
                error.message ||
                "Unable to complete transfer."
            );


            verifyButton.disabled =
                false;

            verifyButton.textContent =
                "Verify & Complete";

        }

    }
);


// =====================================================
// BACK
// =====================================================

document
    .getElementById("backToReview")
    .addEventListener(
        "click",
        function () {

            window.location.href =
                "transfer-review.html";

        }
    );


// =====================================================
// RESEND OTP
// =====================================================

resendButton.addEventListener(
    "click",
    function () {

        if (
            resendButton.disabled
        ) {

            return;

        }


        showSuccess(
            "A new OTP has been sent."
        );


        startResendTimer();

    }
);


// =====================================================
// RESEND TIMER
// =====================================================

function startResendTimer() {

    resendButton.disabled =
        true;

    resendSeconds = 30;


    const timer =
        setInterval(
            function () {

                resendTimer.textContent =
                    ` (${resendSeconds}s)`;


                resendSeconds--;


                if (
                    resendSeconds < 0
                ) {

                    clearInterval(timer);


                    resendButton.disabled =
                        false;


                    resendTimer.textContent =
                        "";

                }

            },
            1000
        );

}


// =====================================================
// MESSAGE HELPERS
// =====================================================

function showError(message) {

    authenticationMessage.textContent =
        message;

    authenticationMessage.className =
        "form-message error-message";

}


function showSuccess(message) {

    authenticationMessage.textContent =
        message;

    authenticationMessage.className =
        "form-message success-message";

}


// =====================================================
// LOGOUT
// =====================================================

document
    .getElementById("logoutButton")
    .addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "user"
            );

            sessionStorage.clear();

            window.location.href =
                "login.html";

        }
    );