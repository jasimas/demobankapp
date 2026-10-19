const ACCOUNT_API =
    "http://localhost:3000/api/accounts";

const BENEFICIARY_API =
    "http://localhost:3000/api/beneficiaries";


const user =
    JSON.parse(
        localStorage.getItem("user")
    );


if (!user) {

    window.location.href =
        "login.html";
}


// =====================================================
// ELEMENTS
// =====================================================

const accountSelect =
    document.getElementById("accountId");

const beneficiarySelect =
    document.getElementById("beneficiaryId");

const accountBalance =
    document.getElementById("accountBalance");

const availableBalance =
    document.getElementById("availableBalance");

const beneficiaryDetails =
    document.getElementById("beneficiaryDetails");

const amountInput =
    document.getElementById("amount");

const purposeSelect =
    document.getElementById("purpose");

const transferForm =
    document.getElementById("transferForm");

const transferMessage =
    document.getElementById("transferMessage");


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
// LOAD ACCOUNTS
// =====================================================

async function loadAccounts() {

    try {

        const response =
            await fetch(
                `${ACCOUNT_API}/${user.id}`
            );


        const data =
            await response.json();


        console.log(
            "Accounts API:",
            data
        );


        if (!response.ok ||
            !data.success) {

            showMessage(
                data.message ||
                "Unable to load accounts",
                "error"
            );

            return;
        }


        accountSelect.innerHTML = `
            <option value="">
                Select account
            </option>
        `;


        data.accounts
            .filter(
                account =>
                    account.status === "ACTIVE"
            )
            .forEach(
                account => {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        account.id;


                    option.dataset.balance =
                        account.balance;


                    option.dataset.currency =
                        account.currency;


                    option.textContent =
                        `${account.account_name} - ${account.account_number} (${account.currency})`;


                    accountSelect.appendChild(
                        option
                    );

                }
            );


    } catch (error) {

        console.error(
            "Account API error:",
            error
        );


        showMessage(
            "Unable to connect to server",
            "error"
        );

    }

}


// =====================================================
// LOAD BENEFICIARIES
// =====================================================

async function loadBeneficiaries() {

    try {

        const response =
            await fetch(
                `${BENEFICIARY_API}/${user.id}`
            );


        const data =
            await response.json();


        console.log(
            "Beneficiary API:",
            data
        );


        if (!response.ok ||
            !data.success) {

            showMessage(
                data.message ||
                "Unable to load beneficiaries",
                "error"
            );

            return;
        }


        beneficiarySelect.innerHTML = `
            <option value="">
                Select beneficiary
            </option>
        `;


        data.beneficiaries
            .filter(
                beneficiary =>
                    beneficiary.status === "ACTIVE"
            )
            .forEach(
                beneficiary => {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        beneficiary.id;


                    option.dataset.bank =
                        beneficiary.bank_name;


                    option.dataset.country =
                        beneficiary.bank_country;


                    option.dataset.account =
                        beneficiary.account_number || "";


                    option.dataset.iban =
                        beneficiary.iban || "";


                    option.textContent =
                        beneficiary.nickname
                            ? `${beneficiary.nickname} - ${beneficiary.beneficiary_name}`
                            : beneficiary.beneficiary_name;


                    beneficiarySelect.appendChild(
                        option
                    );

                }
            );


    } catch (error) {

        console.error(
            "Beneficiary API error:",
            error
        );


        showMessage(
            "Unable to connect to server",
            "error"
        );

    }

}


// =====================================================
// ACCOUNT CHANGE
// =====================================================

accountSelect.addEventListener(
    "change",
    function () {

        const option =
            this.options[
                this.selectedIndex
            ];


        if (!option.value) {

            accountBalance.textContent =
                "";

            availableBalance.textContent =
                "AED 0.00";

            return;
        }


        const balance =
            Number(
                option.dataset.balance
            );


        const currency =
            option.dataset.currency ||
            "AED";


        accountBalance.textContent =
            `Available balance: ${currency} ${balance.toFixed(2)}`;


        availableBalance.textContent =
            `${currency} ${balance.toFixed(2)}`;


        validateAmount();

    }
);


// =====================================================
// BENEFICIARY CHANGE
// =====================================================

beneficiarySelect.addEventListener(
    "change",
    function () {

        const option =
            this.options[
                this.selectedIndex
            ];


        if (!option.value) {

            beneficiaryDetails.textContent =
                "";

            return;
        }


        beneficiaryDetails.textContent =
            `${option.dataset.bank} • ${option.dataset.country} • Account ${option.dataset.account}`;

    }
);


// =====================================================
// AMOUNT VALIDATION
// =====================================================

amountInput.addEventListener(
    "input",
    validateAmount
);


function validateAmount() {

    const option =
        accountSelect.options[
            accountSelect.selectedIndex
        ];


    if (!option ||
        !option.value) {

        return;
    }


    const balance =
        Number(
            option.dataset.balance
        );


    const amount =
        Number(
            amountInput.value
        );


    if (amount <= 0) {

        amountInput.setCustomValidity(
            "Amount must be greater than zero"
        );

        return;
    }


    if (amount > balance) {

        amountInput.setCustomValidity(
            "Insufficient account balance"
        );

        return;
    }


    amountInput.setCustomValidity("");

}


// =====================================================
// SUBMIT
// =====================================================

transferForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        validateAmount();


        if (!transferForm.checkValidity()) {

            transferForm.reportValidity();

            return;
        }


        const accountOption =
            accountSelect.options[
                accountSelect.selectedIndex
            ];


        const beneficiaryOption =
            beneficiarySelect.options[
                beneficiarySelect.selectedIndex
            ];


        const transferData = {

            user_id: user.id,

            account_id:
                Number(
                    accountSelect.value
                ),

            beneficiary_id:
                Number(
                    beneficiarySelect.value
                ),

            amount:
                Number(
                    amountInput.value
                ),

            purpose:
                purposeSelect.value,

            account_name:
                accountOption.textContent,

            beneficiary_name:
                beneficiaryOption.textContent,

            bank_name:
                beneficiaryOption.dataset.bank,

            bank_country:
                beneficiaryOption.dataset.country,

            account_number:
                beneficiaryOption.dataset.account,

            iban:
                beneficiaryOption.dataset.iban

        };


        sessionStorage.setItem(
            "pendingTransfer",
            JSON.stringify(
                transferData
            )
        );


        window.location.href =
            "transfer-review.html";

    }
);


// =====================================================
// CANCEL
// =====================================================

document
    .getElementById("cancelTransfer")
    .addEventListener(
        "click",
        function () {

            window.location.href =
                "Dashboard.html";

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


// =====================================================
// MESSAGE
// =====================================================

function showMessage(
    message,
    type
) {

    transferMessage.textContent =
        message;

    transferMessage.className =
        type === "success"
            ? "success-message"
            : "error-message";

}


// =====================================================
// INITIAL LOAD
// =====================================================

loadAccounts();

loadBeneficiaries();