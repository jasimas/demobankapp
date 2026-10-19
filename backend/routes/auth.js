const express = require("express");

const router = express.Router();

const pool = require("../db");


router.post("/login", async (req, res) => {

    try {

        const {
            username,
            password
        } = req.body;


        // -----------------------------
        // VALIDATE INPUT
        // -----------------------------

        if (!username || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Username and password are required"

            });
        }


        // -----------------------------
        // FIND USER IN MYSQL
        // -----------------------------

        const [users] = await pool.query(

            `SELECT
                id,
                username,
                password,
                full_name
             FROM users
             WHERE username = ?`,

            [username]

        );


        console.log(
            "User found:",
            users.length
        );


        // -----------------------------
        // USER NOT FOUND
        // -----------------------------

        if (users.length === 0) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid username or password"

            });
        }


        const user = users[0];


        // -----------------------------
        // PASSWORD VALIDATION
        // -----------------------------

        if (password !== user.password) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid username or password"

            });
        }


        // -----------------------------
        // LOGIN SUCCESS
        // -----------------------------

        console.log(
            "Login successful:",
            user.username
        );


        return res.json({

            success: true,

            message:
                "Login successful",

            user: {

                id: user.id,

                username:
                    user.username,

                fullName:
                    user.full_name

            }

        });


    } catch (error) {

        console.error(
            "Login API error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error"

        });
    }

});


module.exports = router;