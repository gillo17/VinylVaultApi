import { AwsMapper } from "./mappers/awsMapper";
import { AwsService } from "./services/awsService";

const Types = {

    // controllers
    UserController: Symbol.for('UserController'),
    CollectionsController: Symbol.for('CollectionsController'),

    // Mappers
    UserMapper: Symbol.for('UserMapper'),
    CollectionsMapper: Symbol.for('CollectionsMapper'),
    AWSMapper: Symbol.for('AwsMapper'),

    // Services
    UserService: Symbol.for('UserService'),
    CollectionsService: Symbol.for('CollectionsService'),
    AWSService: Symbol.for('AwsService'),

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