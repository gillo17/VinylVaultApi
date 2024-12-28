import { Container } from 'inversify';
import { UserController } from './controllers/userController';
import { UserMappers } from './mappers/userMappers';
import { UserService } from './services/userService';
import { UserDao } from './daos/userDao';
import Types from './types';
import { SaltAndHash } from './utils/saltAndHash';

const container = new Container();

container.bind<UserController>(Types.UserController).to(UserController);
container.bind<UserMappers>(Types.UserMappers).to(UserMappers);
container.bind<UserService>(Types.UserService).to(UserService);
container.bind<UserDao>(Types.UserDao).to(UserDao);
container.bind<SaltAndHash>(Types.SaltAndHash).to(SaltAndHash);

export default container;
