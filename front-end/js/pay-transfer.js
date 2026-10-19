// =====================================================
// CHECK LOGIN
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
// WELCOME USER
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
// SEND MONEY
// =====================================================

document
    .getElementById("sendMoneyButton")
    .addEventListener(
        "click",
        function () {

            window.location.href =
                "transfer.html";

        }
    );


// =====================================================
// SEND MONEY CARD
// =====================================================

document
    .getElementById("sendMoneyCard")
    .addEventListener(
        "click",
        function (event) {

            if (
                event.target.tagName ===
                "BUTTON"
            ) {

                return;

            }


            window.location.href =
                "transfer.html";

        }
    );


// =====================================================
// MANAGE BENEFICIARY
// =====================================================

document
    .getElementById(
        "manageBeneficiaryButton"
    )
    .addEventListener(
        "click",
        function () {

            window.location.href =
                "manage-beneficiary.html";

        }
    );


// =====================================================
// TRANSACTION HISTORY
// =====================================================

document
    .getElementById(
        "transactionHistoryButton"
    )
    .addEventListener(
        "click",
        function () {

            window.location.href =
                "transaction-history.html";

        }
    );


// =====================================================
// QUICK SEND
// =====================================================

document
    .getElementById("quickSendMoney")
    .addEventListener(
        "click",
        function () {

            window.location.href =
                "transfer.html";

        }
    );


// =====================================================
// QUICK BENEFICIARY
// =====================================================

document
    .getElementById("quickBeneficiary")
    .addEventListener(
        "click",
        function () {

            window.location.href =
                "manage-beneficiary.html";

        }
    );


// =====================================================
// QUICK HISTORY
// =====================================================

document
    .getElementById("quickHistory")
    .addEventListener(
        "click",
        function () {

            window.location.href =
                "transaction-history.html";

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