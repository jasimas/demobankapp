const express = require("express");

const router = express.Router();

const pool = require("../db");


// =====================================================
// CREATE TRANSFER
// =====================================================

router.post("/", async (req, res) => {

    const connection =
        await pool.getConnection();


    try {

        const {
            user_id,
            account_id,
            beneficiary_id,
            amount,
            currency,
            purpose,
            transaction_type,
            authentication_status
        } = req.body;


        // ---------------------------------------------
        // VALIDATION
        // ---------------------------------------------

        if (
            !user_id ||
            !account_id ||
            !beneficiary_id ||
            !amount
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Required transfer details are missing"

            });

        }


        if (Number(amount) <= 0) {

            return res.status(400).json({

                success: false,

                message:
                    "Transfer amount must be greater than zero"

            });

        }


        if (
            authentication_status !==
            "VERIFIED"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Authentication is required"

            });

        }


        await connection.beginTransaction();


        // ---------------------------------------------
        // GET ACCOUNT
        // ---------------------------------------------

        const [accounts] =
            await connection.query(

                `SELECT
                    id,
                    user_id,
                    balance,
                    currency,
                    status
                 FROM accounts
                 WHERE id = ?
                 AND user_id = ?
                 FOR UPDATE`,

                [
                    account_id,
                    user_id
                ]

            );


        if (accounts.length === 0) {

            await connection.rollback();

            return res.status(404).json({

                success: false,

                message:
                    "Account not found"

            });

        }


        const account =
            accounts[0];


        // ---------------------------------------------
        // ACCOUNT STATUS
        // ---------------------------------------------

        if (
            account.status !==
            "ACTIVE"
        ) {

            await connection.rollback();

            return res.status(400).json({

                success: false,

                message:
                    "Account is not active"

            });

        }


        // ---------------------------------------------
        // BALANCE
        // ---------------------------------------------

        const currentBalance =
            Number(
                account.balance
            );


        const transferAmount =
            Number(amount);


        if (
            currentBalance <
            transferAmount
        ) {

            await connection.rollback();

            return res.status(400).json({

                success: false,

                message:
                    "Insufficient account balance"

            });

        }


        // ---------------------------------------------
        // BENEFICIARY
        // ---------------------------------------------

        const [beneficiaries] =
            await connection.query(

                `SELECT
                    id,
                    user_id,
                    beneficiary_name,
                    bank_name,
                    status
                 FROM beneficiaries
                 WHERE id = ?
                 AND user_id = ?
                 FOR UPDATE`,

                [
                    beneficiary_id,
                    user_id
                ]

            );


        if (
            beneficiaries.length === 0
        ) {

            await connection.rollback();

            return res.status(404).json({

                success: false,

                message:
                    "Beneficiary not found"

            });

        }


        const beneficiary =
            beneficiaries[0];


        if (
            beneficiary.status !==
            "ACTIVE"
        ) {

            await connection.rollback();

            return res.status(400).json({

                success: false,

                message:
                    "Beneficiary is not active"

            });

        }


        // ---------------------------------------------
        // REFERENCE NUMBER
        // ---------------------------------------------

        const referenceNumber =
            "JSM" +
            Date.now();


        // ---------------------------------------------
        // INSERT TRANSACTION
        // ---------------------------------------------

        const [result] =
            await connection.query(

                `INSERT INTO transactions
                (
                    user_id,
                    account_id,
                    beneficiary_id,
                    amount,
                    currency,
                    purpose,
                    transaction_type,
                    status,
                    authentication_status,
                    reference_number
                )
                VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

                [
                    user_id,
                    account_id,
                    beneficiary_id,
                    transferAmount,
                    currency || "AED",
                    purpose || null,
                    transaction_type ||
                        "TRANSFER",
                    "SUCCESS",
                    "VERIFIED",
                    referenceNumber
                ]

            );


        // ---------------------------------------------
        // UPDATE BALANCE
        // ---------------------------------------------

        const newBalance =
            currentBalance -
            transferAmount;


        await connection.query(

            `UPDATE accounts
             SET balance = ?
             WHERE id = ?
             AND user_id = ?`,

            [
                newBalance,
                account_id,
                user_id
            ]

        );


        // ---------------------------------------------
        // COMMIT
        // ---------------------------------------------

        await connection.commit();


        // ---------------------------------------------
        // RESPONSE
        // ---------------------------------------------

        return res.status(201).json({

            success: true,

            message:
                "Transfer completed successfully",

            transaction: {

                id:
                    result.insertId,

                reference_number:
                    referenceNumber,

                amount:
                    transferAmount,

                currency:
                    currency || "AED",

                status:
                    "SUCCESS",

                authentication_status:
                    "VERIFIED",

                beneficiary_name:
                    beneficiary.beneficiary_name,

                bank_name:
                    beneficiary.bank_name

            }

        });


    } catch (error) {

        await connection.rollback();


        console.error(
            "Transfer error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to complete transfer"

        });


    } finally {

        connection.release();

    }

});

// =====================================================
// GET TRANSACTION HISTORY
// =====================================================

router.get("/:userId", async (req, res) => {

    try {

        const userId =
            Number(req.params.userId);


        if (!userId) {

            return res.status(400).json({

                success: false,

                message: "Invalid user ID"

            });

        }


        const [transactions] =
            await pool.query(

                `SELECT
                    t.id,
                    t.user_id,
                    t.account_id,
                    t.beneficiary_id,
                    t.amount,
                    t.currency,
                    t.purpose,
                    t.transaction_type,
                    t.status,
                    t.authentication_status,
                    t.reference_number,
                    t.created_at,

                    b.beneficiary_name,
                    b.bank_name

                 FROM transactions t

                 LEFT JOIN beneficiaries b
                    ON t.beneficiary_id = b.id

                 WHERE t.user_id = ?

                 ORDER BY t.created_at DESC`,

                [userId]

            );


        return res.json({

            success: true,

            transactions

        });


    } catch (error) {

        console.error(
            "Transaction history error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch transaction history"

        });

    }

});


module.exports = router;