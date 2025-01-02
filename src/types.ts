const Types = {

    // controllers
    UserController: Symbol.for('UserController'),

    // Mappers
    UserMappers: Symbol.for('UserMappers'),

    // Services
    UserService: Symbol.for('UserService'),

    // Daos
    UserDao: Symbol.for('UserDao'),

    // Utils
    SaltAndHash: Symbol.for('SaltAndHash'),

    // Validators
    UserValidator: Symbol.for('UserValidator'),
};

export default Types;