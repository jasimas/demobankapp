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

document.getElementById(
    "welcomeUser"
).textContent =
    `Welcome, ${user.fullName || user.username}`;


// =====================================================
// ELEMENTS
// =====================================================

const tableBody =
    document.getElementById(
        "transactionTableBody"
    );

const emptyTransactions =
    document.getElementById(
        "emptyTransactions"
    );

const transactionCount =
    document.getElementById(
        "transactionCount"
    );

const statusFilter =
    document.getElementById(
        "statusFilter"
    );

const searchReference =
    document.getElementById(
        "searchReference"
    );


// Store transactions
let allTransactions = [];


// =====================================================
// LOAD TRANSACTIONS
// =====================================================

async function loadTransactions() {

    try {

        const response =
            await fetch(
                `http://localhost:3000/api/transfers/${user.id}`
            );


        const data =
            await response.json();


        if (!response.ok ||
            !data.success) {

            throw new Error(
                data.message ||
                "Unable to load transactions"
            );

        }


        allTransactions =
            data.transactions || [];


        displayTransactions(
            allTransactions
        );


    } catch (error) {

        console.error(error);

        transactionCount.textContent =
            "Unable to load transactions";

        emptyTransactions.style.display =
            "block";

        emptyTransactions.textContent =
            error.message;

    }

}


// =====================================================
// DISPLAY
// =====================================================

function displayTransactions(
    transactions
) {

    tableBody.innerHTML =
        "";


    if (
        transactions.length === 0
    ) {

        emptyTransactions.style.display =
            "block";

        transactionCount.textContent =
            "0 transactions";

        return;

    }


    emptyTransactions.style.display =
        "none";


    transactionCount.textContent =
        `${transactions.length} transaction(s)`;


    transactions.forEach(
        transaction => {

            const row =
                document.createElement(
                    "tr"
                );


            const date =
                new Date(
                    transaction.created_at
                );


            row.innerHTML = `

                <td>
                    ${formatDate(date)}
                </td>

                <td>
                    <strong>
                        ${transaction.reference_number || "-"}
                    </strong>
                </td>

                <td>
                    ${transaction.beneficiary_name || "-"}
                </td>

                <td class="history-amount">
                    AED ${Number(
                        transaction.amount
                    ).toFixed(2)}
                </td>

                <td>
                    ${transaction.purpose || "-"}
                </td>

                <td>
                    <span class="status-badge ${getStatusClass(
                        transaction.status
                    )}">
                        ${transaction.status}
                    </span>
                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );

}


// =====================================================
// FILTER
// =====================================================

document
    .getElementById("searchTransactions")
    .addEventListener(
        "click",
        function () {

            const status =
                statusFilter.value
                    .trim()
                    .toUpperCase();


            const reference =
                searchReference.value
                    .trim()
                    .toLowerCase();


            const filtered =
                allTransactions.filter(
                    transaction => {

                        const statusMatch =
                            !status ||
                            transaction.status
                                .toUpperCase() ===
                            status;


                        const referenceMatch =
                            !reference ||
                            (
                                transaction.reference_number ||
                                ""
                            )
                                .toLowerCase()
                                .includes(
                                    reference
                                );


                        return (
                            statusMatch &&
                            referenceMatch
                        );

                    }
                );


            displayTransactions(
                filtered
            );

        }
    );


// =====================================================
// DATE
// =====================================================

function formatDate(date) {

    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// =====================================================
// STATUS CLASS
// =====================================================

function getStatusClass(
    status
) {

    if (
        status === "SUCCESS"
    ) {

        return "status-success";

    }


    if (
        status === "FAILED"
    ) {

        return "status-failed";

    }


    return "status-pending";

}


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

            sessionStorage.clear();

            window.location.href =
                "login.html";

        }
    );


// =====================================================
// INITIAL LOAD
// =====================================================

loadTransactions();