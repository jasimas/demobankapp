const express = require("express");

const router = express.Router();

const pool = require("../db");


// =====================================================
// GET ACCOUNTS FOR LOGGED-IN USER
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


        const [accounts] =
            await pool.query(

                `SELECT
                    id,
                    user_id,
                    account_name,
                    account_number,
                    currency,
                    balance,
                    status
                 FROM accounts
                 WHERE user_id = ?
                 ORDER BY id`,

                [userId]

            );


        return res.json({

            success: true,

            accounts

        });


    } catch (error) {

        console.error(
            "Get accounts error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Unable to fetch accounts"

        });

    }

});


module.exports = router;