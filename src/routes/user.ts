import express from 'express';
import container from '../inversify.config';
import Types from '../types';
import { UserController } from '../controllers/userController';

const router = express.Router();

const userController = container.get<UserController>(Types.UserController);

router.post('/createUser', (req, res) => {
    userController.createUser(req, res);
});

router.get('/accountLogin', (req, res) => {
    userController.accountLogin(req, res);
});

export = router;
