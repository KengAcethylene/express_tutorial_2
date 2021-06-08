require('express-async-errors');
require('./config_env');

const express = require('express');
const morgan = require('morgan');

const cookieParser = require('cookie-parser');
const errorHandler = require('./shared/middleware/errorHandler');
const dbMiddleware = require('./shared/middleware/dbMiddleware');

const { connectDB, disconnectDB } = require('./db/dbConnect');

const authRoute = require('./node_app/controller/auth');
const withauthRoute = require('./node_app/controller/with_auth');
const noauthRoute = require('./node_app/controller/no_auth');
const echoRoute = require('./node_app/controller/echo');
const main = async () => {

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
        app.use(morgan('common'));
    }
    app.use(dbMiddleware);

    app.get("/check", (req, res) => {
        res.send("Server OK!!!");
    });

    //* Route
    app.use("/app/echo", echoRoute);
    app.use("/app/auth", authRoute);
    app.use("/app/no_auth", noauthRoute);
    app.use("/app/with_auth", withauthRoute);

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