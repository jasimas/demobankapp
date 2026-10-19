const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const beneficiaryRoutes = require("./routes/beneficiary");
const accountRoutes =
    require("./routes/account");

const transferRoutes =
    require("./routes/transfer");
const app = express();


// Middleware

app.use(cors());

app.use(express.json());


// API routes

app.use(
    "/api/auth",
    authRoutes
);

app.use("/api/beneficiaries", beneficiaryRoutes);
app.use(
    "/api/accounts",
    accountRoutes
);
app.use(
    "/api/transfers",
    transferRoutes
);

// Test API

app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        message: "Jasima Bank API is running"
    });

});


// Start server

const PORT = 3000;

app.listen(PORT, () => {

    console.log(
        `Jasima Bank API running on http://localhost:${PORT}`
    );

});