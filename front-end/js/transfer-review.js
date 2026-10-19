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
// GET PENDING TRANSFER
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
// DISPLAY TRANSFER DETAILS
// =====================================================

document.getElementById(
    "reviewAccount"
).textContent =
    pendingTransfer.account_name || "-";


document.getElementById(
    "reviewBeneficiary"
).textContent =
    pendingTransfer.beneficiary_name || "-";


document.getElementById(
    "reviewBank"
).textContent =
    pendingTransfer.bank_name || "-";


document.getElementById(
    "reviewCountry"
).textContent =
    pendingTransfer.bank_country || "-";


document.getElementById(
    "reviewAccountNumber"
).textContent =
    pendingTransfer.account_number || "-";


document.getElementById(
    "reviewIban"
).textContent =
    pendingTransfer.iban || "-";


document.getElementById(
    "reviewAmount"
).textContent =
    `AED ${Number(
        pendingTransfer.amount
    ).toFixed(2)}`;


document.getElementById(
    "reviewPurpose"
).textContent =
    pendingTransfer.purpose || "Not specified";


// =====================================================
// GET CURRENT ACCOUNT BALANCE
// =====================================================

async function loadAccountBalance() {

    try {

        const response =
            await fetch(
                `http://localhost:3000/api/accounts/${user.id}`
            );


        const data =
            await response.json();


        if (!data.success) {

            return;
        }


        const account =
            data.accounts.find(
                account =>
                    Number(account.id) ===
                    Number(
                        pendingTransfer.account_id
                    )
            );


        if (!account) {

            document.getElementById(
                "reviewBalance"
            ).textContent =
                "Account not found";

            return;
        }


        document.getElementById(
            "reviewBalance"
        ).textContent =
            `${account.currency} ${Number(
                account.balance
            ).toFixed(2)}`;


    } catch (error) {

        console.error(
            "Balance error:",
            error
        );

    }

}


loadAccountBalance();


// =====================================================
// EDIT TRANSFER
// =====================================================

document
    .getElementById("editTransfer")
    .addEventListener(
        "click",
        function () {

            window.location.href =
                "transfer.html";

        }
    );


// =====================================================
// CONTINUE
// =====================================================

document
    .getElementById("continueReview")
    .addEventListener(
        "click",
        function () {

            /*
             * We are NOT creating the transaction
             * yet.
             *
             * The next page will handle authentication.
             */

            window.location.href =
                "transfer-authentication.html";

        }
    );


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

            sessionStorage.removeItem(
                "pendingTransfer"
            );

            window.location.href =
                "login.html";

        }
    );