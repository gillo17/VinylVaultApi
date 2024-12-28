import { Request, Response } from 'express';
import { UserMappers } from '../mappers/userMappers';
import { UserService } from '../services/userService';
import Types from '../types';
import { injectable, inject } from 'inversify';
import Logging from '../utils/Logging';

@injectable()
export class UserController {
    public constructor(
        @inject(Types.UserMappers) private userMappers: UserMappers,
        @inject(Types.UserService) private userService: UserService
    ) {}

    public createUser = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        const userInfo = await this.userMappers.mapRequestToUser(req);

        try {
            const result = await this.userService.createuser(userInfo);

            if (!result) {
                return res.status(201).json({ message: 'User created' });
            } else {
                return res.status(500).json({ error: result });
            }
        } catch (error) {
            return res.status(500).json({ error: String(error) });
        }
    };

    public accountLogin = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        const userInfo = this.userMappers.mapRequestToUserLogin(req);

        Logging.info(userInfo);

        const result = await this.userService.accountLogin(userInfo);

        if (result) {
            return res.status(200).json({ token: result[0] });
        } else {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }
    };
}
