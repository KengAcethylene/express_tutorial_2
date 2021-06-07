require('express-async-errors');
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const errorHandler = require('./shared/errorHandler');
const authHandler = require('./shared/auth');
const cookieParser = require('cookie-parser');
const { connectDB, disconnectDB } = require('./utils/dbConnect');
const authRoute = require('./controller/auth');
const withauthRoute = require('./controller/with-auth');

const main = async () => {
    dotenv.config({ path: path.join(__dirname, ".env") });
    dotenv.config({ path: path.join(__dirname, ".env.default") });

    //* connect database
    await connectDB();

    const app = express();
    const PORT = process.env.PORT || 3000;

    //* middleware
    app.use(express.static("public"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());

    if (process.env.ENV === 'dev') {
        app.use(morgan("dev"));
    }

    app.get("/check", (req, res) => {
        res.send("Server OK!!!");
    });

    //* Route
    app.use("/app/auth", authRoute);
    app.use("/app/with_auth", authHandler, withauthRoute);

    //* 404 Not Found
    app.use((req, res) => {
        res.status(404);
        res.setHeader("content-type", "text/html");
        res.sendFile(path.join(__dirname, "public", "index.html"));
    });

    //* Error Handler
    app.use(errorHandler);
    app.use((err, req, res, next) => {
        res.status(500).json({ err: err.message, tor: true });
    });

    const server = app.listen(PORT, () => {
        console.log("Service has started!!!!");
    });

    //* graceful shutdown
    process.on('SIGTERM', () => {
        debug('SIGTERM signal received: closing HTTP server');
        server.close(async () => {
            debug('HTTP server closed');
            await disconnectDB();
        });
    });
};

main();