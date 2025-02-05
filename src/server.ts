import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import Logging from './utils/Logging';
import userRouter from './routes/user';
import collectionsRouter from './routes/collections';
import vinylRouter from './routes/vinyl';
import { verifyToken } from './middleware/auth';
import cors from 'cors';

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

    router.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));


    router.use('/user', userRouter);
    router.use('/collections', verifyToken, collectionsRouter);
    router.use('/vinyl', verifyToken, vinylRouter);

    router.use((req, res, next) => {
        const error = new Error(`Route Not found`);
        Logging.error(`Route Not Found - Route: ${req.originalUrl}`);

        res.status(404).json({ message: error.message });
        next();
    });

    http.createServer(router).listen(config.server.port, () => {
        Logging.info(`Server is running on port ${config.server.port}`);
    });
};
