const user =
    JSON.parse(
        localStorage.getItem("user")
    );


if (!user) {

    window.location.href =
        "login.html";

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
// COMPLETED TRANSACTION
// =====================================================

const completedTransfer =
    JSON.parse(
        sessionStorage.getItem(
            "completedTransfer"
        )
    );


if (!completedTransfer) {

    alert(
        "Transfer information is not available."
    );

    window.location.href =
        "Dashboard.html";

}


// =====================================================
// DISPLAY SUCCESS DETAILS
// =====================================================

document.getElementById(
    "successAmount"
).textContent =
    `AED ${Number(
        completedTransfer.amount
    ).toFixed(2)}`;


document.getElementById(
    "successBeneficiary"
).textContent =
    completedTransfer.beneficiary_name || "-";


document.getElementById(
    "successBank"
).textContent =
    completedTransfer.bank_name || "-";


document.getElementById(
    "successReference"
).textContent =
    completedTransfer.reference_number || "-";


// =====================================================
// TRANSACTION HISTORY
// =====================================================

document
    .getElementById("viewTransactions")
    .addEventListener(
        "click",
        function () {

            window.location.href =
                "transaction-history.html";

        }
    );


// =====================================================
// DASHBOARD
// =====================================================

document
    .getElementById("backDashboard")
    .addEventListener(
        "click",
        function () {

            window.location.href =
                "Dashboard.html";

        }
    );


// =====================================================
// ANOTHER TRANSFER
// =====================================================

document
    .getElementById("makeAnotherTransfer")
    .addEventListener(
        "click",
        function () {

            sessionStorage.removeItem(
                "completedTransfer"
            );

            window.location.href =
                "transfer.html";

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

            sessionStorage.clear();

            window.location.href =
                "login.html";

        }
    );