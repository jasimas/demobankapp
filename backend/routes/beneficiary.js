const express = require("express");
const router = express.Router();
const pool = require("../db");

// =====================================================
// GET ALL BENEFICIARIES FOR A USER
// GET /api/beneficiaries/:userId
// =====================================================

router.get("/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        const [rows] = await pool.query(
            `SELECT
                id,
                user_id,
                beneficiary_name,
                nickname,
                bank_name,
                bank_country,
                account_number,
                iban,
                status,
                created_at,
                updated_at
             FROM beneficiaries
             WHERE user_id = ?
             ORDER BY id DESC`,
            [userId]
        );

        res.json({
            success: true,
            beneficiaries: rows
        });

    } catch (error) {
        console.error("Get beneficiaries error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch beneficiaries"
        });
    }
});


// =====================================================
// ADD BENEFICIARY
// POST /api/beneficiaries
// =====================================================

router.post("/", async (req, res) => {
    try {
        const {
            user_id,
            beneficiary_name,
            nickname,
            bank_name,
            bank_country,
            account_number,
            iban
        } = req.body;

        if (
            !user_id ||
            !beneficiary_name ||
            !bank_name ||
            !bank_country
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "User ID, beneficiary name, bank name and bank country are required"
            });
        }

        const [result] = await pool.query(
            `INSERT INTO beneficiaries
            (
                user_id,
                beneficiary_name,
                nickname,
                bank_name,
                bank_country,
                account_number,
                iban,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
            [
                user_id,
                beneficiary_name,
                nickname || null,
                bank_name,
                bank_country,
                account_number || null,
                iban || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Beneficiary added successfully",
            beneficiaryId: result.insertId
        });

    } catch (error) {
        console.error("Add beneficiary error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to add beneficiary"
        });
    }
});


// =====================================================
// UPDATE BENEFICIARY
// PUT /api/beneficiaries/:id
// =====================================================

router.put("/:id", async (req, res) => {
    try {
        const beneficiaryId = req.params.id;

        const {
            beneficiary_name,
            nickname,
            bank_name,
            bank_country,
            account_number,
            iban
        } = req.body;

        if (
            !beneficiary_name ||
            !bank_name ||
            !bank_country
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Beneficiary name, bank name and bank country are required"
            });
        }

        const [result] = await pool.query(
            `UPDATE beneficiaries
             SET
                beneficiary_name = ?,
                nickname = ?,
                bank_name = ?,
                bank_country = ?,
                account_number = ?,
                iban = ?
             WHERE id = ?`,
            [
                beneficiary_name,
                nickname || null,
                bank_name,
                bank_country,
                account_number || null,
                iban || null,
                beneficiaryId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Beneficiary not found"
            });
        }

        res.json({
            success: true,
            message: "Beneficiary updated successfully"
        });

    } catch (error) {
        console.error("Update beneficiary error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to update beneficiary"
        });
    }
});


// =====================================================
// DELETE BENEFICIARY
// DELETE /api/beneficiaries/:id
// =====================================================

router.delete("/:id", async (req, res) => {
    try {
        const beneficiaryId = req.params.id;

        const [result] = await pool.query(
            `DELETE FROM beneficiaries
             WHERE id = ?`,
            [beneficiaryId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Beneficiary not found"
            });
        }

        res.json({
            success: true,
            message: "Beneficiary deleted successfully"
        });

    } catch (error) {
        console.error("Delete beneficiary error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to delete beneficiary"
        });
    }
});


module.exports = router;