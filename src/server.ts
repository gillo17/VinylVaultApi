import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import Logging from './utils/Logging';
import userRouter from './routes/user';

const router = express();

mongoose
    .connect(config.mongo.url, { w: 'majority', retryWrites: true })
    .then(() => {
        Logging.info('Connected to MongoDB');
        ServerStart();
    })
    .catch((error) => {
        Logging.error('error connecting to MongoDB');
        Logging.error(error);
    });

const ServerStart = () => {
    router.use((req, res, next) => {
        Logging.info(
            `Incoming request: ${req.method} url - ${req.originalUrl}`
        );

        res.on('finish', () => {
            Logging.info(
                `Outgoing response: method - ${req.method} Status - ${res.statusCode}`
            );
        });

        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    router.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader(
            'Access-Control-Allow-Headers',
            'Content-Type, Authorization'
        );
        next();
    });

    router.use('/user', userRouter);

    router.use((req, res, next) => {
        const error = new Error(`Route Not found`);
        Logging.error(`Route Not Found - Route: ${req.originalUrl}`);

        res.status(404).json({ message: error.message });
    });

    http.createServer(router).listen(config.server.port, () => {
        Logging.info(`Server is running on port ${config.server.port}`);
    });
};
