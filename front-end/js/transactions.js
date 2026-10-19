// =====================================================
// CHECK LOGIN
// =====================================================

const user = JSON.parse(
    localStorage.getItem("user")
);


if (!user) {

    window.location.href = "login.html";

}


// =====================================================
// ELEMENTS
// =====================================================

const welcomeUser =
    document.getElementById("welcomeUser");


const tableBody =
    document.getElementById("transactionTableBody");


const transactionCount =
    document.getElementById("transactionCount");


const emptyMessage =
    document.getElementById("emptyMessage");


const errorMessage =
    document.getElementById("errorMessage");


const statusFilter =
    document.getElementById("statusFilter");


const referenceFilter =
    document.getElementById("referenceFilter");


const filterButton =
    document.getElementById("filterButton");


const clearFilter =
    document.getElementById("clearFilter");


const logoutButton =
    document.getElementById("logoutButton");


// =====================================================
// USER NAME
// =====================================================

if (user) {

    welcomeUser.textContent =
        `Welcome, ${user.fullName || user.username}`;

}


// =====================================================
// STORE TRANSACTIONS
// =====================================================

let transactions = [];


// =====================================================
// LOAD TRANSACTIONS
// =====================================================

async function loadTransactions() {

    try {

        transactionCount.textContent =
            "Loading transactions...";


        const response =
            await fetch(
                `http://localhost:3000/api/transfers/${user.id}`
            );


        const data =
            await response.json();


        console.log(
            "Transaction API response:",
            data
        );


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Unable to load transactions"
            );

        }


        transactions =
            data.transactions || [];


        displayTransactions(
            transactions
        );


    } catch (error) {

        console.error(
            "Transaction error:",
            error
        );


        transactionCount.textContent =
            "Unable to load transactions";


        errorMessage.style.display =
            "block";


        errorMessage.textContent =
            error.message;

    }

}


// =====================================================
// DISPLAY TRANSACTIONS
// =====================================================

function displayTransactions(data) {

    tableBody.innerHTML = "";


    errorMessage.style.display =
        "none";


    if (!data.length) {

        emptyMessage.style.display =
            "block";


        transactionCount.textContent =
            "0 transactions";


        return;

    }


    emptyMessage.style.display =
        "none";


    transactionCount.textContent =
        `${data.length} transaction(s)`;


    data.forEach(
        transaction => {

            const row =
                document.createElement("tr");


            const date =
                transaction.created_at
                    ? new Date(
                        transaction.created_at
                    ).toLocaleString(
                        "en-IN",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    )
                    : "-";


            const amount =
                Number(
                    transaction.amount
                ).toFixed(2);


            row.innerHTML = `

                <td>
                    ${date}
                </td>

                <td>

                    <strong>
                        ${transaction.reference_number || "-"}
                    </strong>

                </td>

                <td>
                    ${transaction.beneficiary_name || "-"}
                </td>

                <td>
                    ${transaction.bank_name || "-"}
                </td>

                <td class="transaction-amount">
                    ${transaction.currency || "AED"}
                    ${amount}
                </td>

                <td>
                    ${transaction.purpose || "-"}
                </td>

                <td>

                    <span class="transaction-status
                        ${getStatusClass(transaction.status)}">

                        ${transaction.status || "-"}

                    </span>

                </td>

            `;


            tableBody.appendChild(row);

        }
    );

}


// =====================================================
// STATUS CLASS
// =====================================================

function getStatusClass(status) {

    switch (
        String(status).toUpperCase()
    ) {

        case "SUCCESS":

            return "status-success";


        case "FAILED":

            return "status-failed";


        case "PENDING":

            return "status-pending";


        default:

            return "";

    }

}


// =====================================================
// FILTER
// =====================================================

filterButton.addEventListener(
    "click",
    function () {

        const selectedStatus =
            statusFilter.value
                .trim()
                .toUpperCase();


        const reference =
            referenceFilter.value
                .trim()
                .toLowerCase();


        const filtered =
            transactions.filter(
                transaction => {

                    const status =
                        String(
                            transaction.status || ""
                        ).toUpperCase();


                    const ref =
                        String(
                            transaction.reference_number || ""
                        ).toLowerCase();


                    const statusMatches =
                        !selectedStatus ||
                        status === selectedStatus;


                    const referenceMatches =
                        !reference ||
                        ref.includes(reference);


                    return (
                        statusMatches &&
                        referenceMatches
                    );

                }
            );


        displayTransactions(
            filtered
        );

    }
);


// =====================================================
// CLEAR FILTER
// =====================================================

clearFilter.addEventListener(
    "click",
    function () {

        statusFilter.value = "";

        referenceFilter.value = "";


        displayTransactions(
            transactions
        );

    }
);


// =====================================================
// LOGOUT
// =====================================================

logoutButton.addEventListener(
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


// =====================================================
// INITIAL LOAD
// =====================================================

if (user) {

    loadTransactions();

}.
























