const API_URL = "http://localhost:3000/api/beneficiaries";

// Get logged-in user
const user = JSON.parse(localStorage.getItem("user"));


// =====================================================
// CHECK LOGIN
// =====================================================

if (!user) {

    alert("Please login first.");

    window.location.href = "login.html";

}


// =====================================================
// GET ELEMENTS
// =====================================================

const beneficiaryForm =
    document.getElementById("beneficiaryForm");

const beneficiaryName =
    document.getElementById("beneficiaryName");

const nickname =
    document.getElementById("nickname");

const bankName =
    document.getElementById("bankName");

const bankCountry =
    document.getElementById("bankCountry");

const accountNumber =
    document.getElementById("accountNumber");

const iban =
    document.getElementById("iban");

const beneficiaryMessage =
    document.getElementById("beneficiaryMessage");

const beneficiaryTable =
    document.getElementById("beneficiaryTable");


// =====================================================
// LOAD BENEFICIARIES
// =====================================================

async function loadBeneficiaries() {

    try {

        const response = await fetch(
            `${API_URL}/${user.id}`
        );

        const data = await response.json();

        if (!data.success) {

            showMessage(
                data.message || "Unable to load beneficiaries",
                "error"
            );

            return;
        }

        displayBeneficiaries(
            data.beneficiaries
        );

    } catch (error) {

        console.error(
            "Load beneficiaries error:",
            error
        );

        showMessage(
            "Unable to connect to server",
            "error"
        );
    }
}


// =====================================================
// DISPLAY BENEFICIARIES
// =====================================================

function displayBeneficiaries(
    beneficiaries
) {

    if (!beneficiaryTable) {
        return;
    }


    beneficiaryTable.innerHTML = "";


    if (beneficiaries.length === 0) {

        beneficiaryTable.innerHTML = `
            <tr>
                <td colspan="7">
                    No beneficiaries found
                </td>
            </tr>
        `;

        return;
    }


    beneficiaries.forEach(
        beneficiary => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${escapeHtml(
                        beneficiary.beneficiary_name
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        beneficiary.nickname || "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        beneficiary.bank_name
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        beneficiary.bank_country
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        beneficiary.account_number || "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        beneficiary.status
                    )}
                </td>

                <td>

                    <button
                        class="edit-btn"
                        onclick="editBeneficiary(
                            ${beneficiary.id}
                        )">

                        Edit

                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteBeneficiary(
                            ${beneficiary.id}
                        )">

                        Delete

                    </button>

                </td>

            `;


            beneficiaryTable.appendChild(row);

        }
    );
}


// =====================================================
// ADD BENEFICIARY
// =====================================================

if (beneficiaryForm) {

    beneficiaryForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const beneficiaryData = {

                user_id: user.id,

                beneficiary_name:
                    beneficiaryName.value.trim(),

                nickname:
                    nickname.value.trim(),

                bank_name:
                    bankName.value.trim(),

                bank_country:
                    bankCountry.value.trim(),

                account_number:
                    accountNumber.value.trim(),

                iban:
                    iban.value.trim()

            };


            if (
                !beneficiaryData.beneficiary_name ||
                !beneficiaryData.bank_name ||
                !beneficiaryData.bank_country
            ) {

                showMessage(
                    "Please fill all required fields.",
                    "error"
                );

                return;
            }


            try {

                const response = await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                beneficiaryData
                            )
                    }
                );


                const data =
                    await response.json();


                if (!data.success) {

                    showMessage(
                        data.message ||
                        "Unable to add beneficiary",
                        "error"
                    );

                    return;
                }


                showMessage(
                    "Beneficiary added successfully.",
                    "success"
                );


                beneficiaryForm.reset();


                await loadBeneficiaries();

            } catch (error) {

                console.error(
                    "Add beneficiary error:",
                    error
                );

                showMessage(
                    "Unable to connect to server.",
                    "error"
                );
            }

        }
    );

}


// =====================================================
// DELETE BENEFICIARY
// =====================================================

async function deleteBeneficiary(
    beneficiaryId
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this beneficiary?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(

            `${API_URL}/${beneficiaryId}`,

            {
                method: "DELETE"
            }

        );


        const data =
            await response.json();


        if (!data.success) {

            showMessage(
                data.message ||
                "Unable to delete beneficiary",
                "error"
            );

            return;
        }


        showMessage(
            "Beneficiary deleted successfully.",
            "success"
        );


        await loadBeneficiaries();

    } catch (error) {

        console.error(
            "Delete beneficiary error:",
            error
        );

        showMessage(
            "Unable to connect to server.",
            "error"
        );
    }
}


// =====================================================
// EDIT BENEFICIARY
// =====================================================

async function editBeneficiary(
    beneficiaryId
) {

    const newName =
        prompt(
            "Enter beneficiary name:"
        );


    if (!newName) {
        return;
    }


    const newNickname =
        prompt(
            "Enter nickname:"
        );


    const newBankName =
        prompt(
            "Enter bank name:"
        );


    const newBankCountry =
        prompt(
            "Enter bank country:"
        );


    const newAccountNumber =
        prompt(
            "Enter account number:"
        );


    const newIban =
        prompt(
            "Enter IBAN:"
        );


    const beneficiaryData = {

        beneficiary_name:
            newName.trim(),

        nickname:
            newNickname
                ? newNickname.trim()
                : "",

        bank_name:
            newBankName
                ? newBankName.trim()
                : "",

        bank_country:
            newBankCountry
                ? newBankCountry.trim()
                : "",

        account_number:
            newAccountNumber
                ? newAccountNumber.trim()
                : "",

        iban:
            newIban
                ? newIban.trim()
                : ""

    };


    try {

        const response = await fetch(

            `${API_URL}/${beneficiaryId}`,

            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        beneficiaryData
                    )
            }

        );


        const data =
            await response.json();


        if (!data.success) {

            showMessage(
                data.message ||
                "Unable to update beneficiary",
                "error"
            );

            return;
        }


        showMessage(
            "Beneficiary updated successfully.",
            "success"
        );


        await loadBeneficiaries();

    } catch (error) {

        console.error(
            "Update beneficiary error:",
            error
        );

        showMessage(
            "Unable to connect to server.",
            "error"
        );
    }
}


// =====================================================
// MESSAGE
// =====================================================

function showMessage(
    message,
    type
) {

    if (!beneficiaryMessage) {
        return;
    }


    beneficiaryMessage.textContent =
        message;


    beneficiaryMessage.className =
        type === "success"
            ? "success-message"
            : "error-message";
}


// =====================================================
// BASIC HTML ESCAPING
// =====================================================

function escapeHtml(value) {

    if (value === null ||
        value === undefined) {

        return "";
    }


    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");
}


// =====================================================
// MAKE FUNCTIONS AVAILABLE TO HTML
// =====================================================

window.deleteBeneficiary =
    deleteBeneficiary;

window.editBeneficiary =
    editBeneficiary;


// =====================================================
// LOAD DATA WHEN PAGE OPENS
// =====================================================

loadBeneficiaries();