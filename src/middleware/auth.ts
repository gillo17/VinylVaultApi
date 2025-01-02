import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import Logging from '../utils/Logging';

const secret = process.env.JWT_SECRET;

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers['authorization'];

    if (!token) {
        res.status(401).json({ message: 'Access Denied: No Token Provided!' });
        return;
    }

    try {
        if (!secret) {
            Logging.error('JWT_SECRET is not defined');
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        } else {
            const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
            req.body.user = decoded;
            next();
        }
    } catch (error) {
        res.status(401).json({ message: 'Invalid Token' });
        return;
    }
};