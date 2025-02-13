import { Container } from 'inversify';
import { UserController } from './controllers/userController';
import { UserMapper } from './mappers/userMapper';
import { UserService } from './services/userService';
import { UserDao } from './daos/userDao';
import Types from './types';
import { SaltAndHash } from './utils/saltAndHash';
import { UserValidator } from './validators/userValidator';
import { CollectionsController } from './controllers/collectionsController';
import { CollectionsService } from './services/collectionsService';
import { CollectionsDao } from './daos/collectionsDao';
import { CollectionsValidator } from './validators/collectionsValidator';
import { CollectionsMapper } from './mappers/collectionsMapper';
import { AwsMapper } from './mappers/awsMapper';
import { AwsService } from './services/awsService';
import { SpotifyService } from './services/spotifyService';
import { SpotifyMapper } from './mappers/spotifyMapper';
import { OpenAIService } from './services/openAIService';
import { VinylController } from './controllers/vinylController';
import { VinylService } from './services/vinylService';

const container = new Container();

// User module
container.bind<UserController>(Types.UserController).to(UserController);
container.bind<UserMapper>(Types.UserMapper).to(UserMapper);
container.bind<UserService>(Types.UserService).to(UserService);
container.bind<UserDao>(Types.UserDao).to(UserDao);
container.bind<SaltAndHash>(Types.SaltAndHash).to(SaltAndHash);
container.bind<UserValidator>(Types.UserValidator).to(UserValidator);

// Collections module
container.bind<CollectionsController>(Types.CollectionsController).to(CollectionsController);
container.bind<CollectionsService>(Types.CollectionsService).to(CollectionsService);
container.bind<CollectionsDao>(Types.CollectionsDao).to(CollectionsDao);
container.bind<CollectionsValidator>(Types.CollectionsValidator).to(CollectionsValidator);
container.bind<CollectionsMapper>(Types.CollectionsMapper).to(CollectionsMapper);

// Vinyl module
container.bind<VinylController>(Types.VinylController).to(VinylController);
container.bind<VinylService>(Types.VinylService).to(VinylService);

// AWS module
container.bind<AwsService>(Types.AWSService).to(AwsService);
container.bind<AwsMapper>(Types.AWSMapper).to(AwsMapper);

// Spotify module
container.bind<SpotifyService>(Types.SpotifyService).to(SpotifyService);
container.bind<SpotifyMapper>(Types.SpotifyMapper).to(SpotifyMapper);

// OpenAI module
container.bind<OpenAIService>(Types.OpenAIService).to(OpenAIService);

export default container;
