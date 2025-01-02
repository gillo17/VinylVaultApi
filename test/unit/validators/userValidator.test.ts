import { UserValidator } from '../../../src/validators/userValidator';
import { describe, expect, test, jest } from '@jest/globals';

describe('User Validator Tests', () => {

    const userValidator = new UserValidator();

    describe("Create Account Validation", () => {
        
        let testRequest: any;

        beforeEach(() => {
            testRequest = {
                body: {
                    email: 'test@test.com',
                    password: 'password',
                    firstname: 'test',
                    lastname: 'test',
                },
            };
        })

        describe("Email Validation", () => {
            
            test('valid request should return no errors', async () => {
                const errors = await userValidator.validateCreateAccount(testRequest);

                expect(errors).toHaveLength(0);

            });

            test('if no email is provided an error should be returned', async () => {

                testRequest.body.email = '';

                const errors = await userValidator.validateCreateAccount(testRequest);

                expect(errors).toHaveLength(1);
                expect(errors).toContain('Email is required');
            });

            test('if an invalid email is provided an error should be returned', async () => {

                testRequest.body.email = 'test.test.com';

                const errors = await userValidator.validateCreateAccount(testRequest);

                expect(errors).toHaveLength(1);
                expect(errors).toContain('Please enter a valid email address');
            });

            test('if an email more than 50 characters long an error should be returned', async () => {

                testRequest.body.email = 'qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm@gmail.com';

                const errors = await userValidator.validateCreateAccount(testRequest);

                expect(errors).toHaveLength(1);
                expect(errors).toContain('Email is too long, max 50 characters');
            });
        });

        describe("First Name Validation", () => {
            test('if no firstname is provided an error should be returned', async () => {

                testRequest.body.firstname = '';

                const errors = await userValidator.validateCreateAccount(testRequest);

                expect(errors).toHaveLength(1);
                expect(errors).toContain('First name is required');
            });

            test('if firstname is longer than 50 characters an error should be returned', async () => {

                testRequest.body.firstname = 'qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasd';

                const errors = await userValidator.validateCreateAccount(testRequest);

                expect(errors).toHaveLength(1);
                expect(errors).toContain('firstname is too long, max 50 characters');
            });

            test('if firstname is longer than 50 characters an error should be returned', async () => {

                testRequest.body.firstname = '123456';

                const errors = await userValidator.validateCreateAccount(testRequest);

                expect(errors).toHaveLength(1);
                expect(errors).toContain('First name must be alphabetic');
            });
        })

        describe("Last Name Validation", () => {
            test('if no lastname is provided an error should be returned', async () => {

                testRequest.body.lastname = '';

                const errors = await userValidator.validateCreateAccount(testRequest);

                expect(errors).toHaveLength(1);
                expect(errors).toContain('Last name is required');
            });

            test('if lastname is longer than 50 characters an error should be returned', async () => {

                testRequest.body.lastname = 'qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasd';

                const errors = await userValidator.validateCreateAccount(testRequest);

                expect(errors).toHaveLength(1);
                expect(errors).toContain('Last name is too long, max 50 characters');
            });

            test('if lastname is longer than 50 characters an error should be returned', async () => {

                testRequest.body.lastname = '123456';

                const errors = await userValidator.validateCreateAccount(testRequest);

                expect(errors).toHaveLength(1);
                expect(errors).toContain('Last name must be alphabetic');
            });
        })

        describe("Password Validation", () => {
            test('if no password is provided an error should be returned', async () => {

                testRequest.body.password = '';

                const errors = await userValidator.validateCreateAccount(testRequest);

                expect(errors).toHaveLength(1);
                expect(errors).toContain('Password is required');
            });
        });
    });
});