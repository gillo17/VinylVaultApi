import { OpenAIService } from "./services/openAIService";

const Types = {

    // controllers
    UserController: Symbol.for('UserController'),
    CollectionsController: Symbol.for('CollectionsController'),
    VinylController: Symbol.for('VinylController'),

    // Mappers
    UserMapper: Symbol.for('UserMapper'),
    CollectionsMapper: Symbol.for('CollectionsMapper'),
    AWSMapper: Symbol.for('AwsMapper'),
    SpotifyMapper: Symbol.for('SpotifyMapper'),

    // Services
    UserService: Symbol.for('UserService'),
    CollectionsService: Symbol.for('CollectionsService'),
    AWSService: Symbol.for('AwsService'),
    SpotifyService: Symbol.for('SpotifyService'),
    OpenAIService: Symbol.for('OpenAIService'),

    // Daos
    UserDao: Symbol.for('UserDao'),
    CollectionsDao: Symbol.for('CollectionsDao'),

    // Utils
    SaltAndHash: Symbol.for('SaltAndHash'),

    // Validators
    UserValidator: Symbol.for('UserValidator'),
    CollectionsValidator: Symbol.for('CollectionsValidator'),
};

export default Types;