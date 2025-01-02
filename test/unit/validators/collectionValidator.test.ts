import Collection from '../../../src/models/collections';
import { CollectionsValidator } from '../../../src/validators/collectionsValidator';
import { describe, expect, test, beforeEach } from '@jest/globals';

describe('Collection Validator Tests', () => {
    
    const collectionsValidator = new CollectionsValidator();
    var testRequest: any;

    beforeEach(() => {
        testRequest = {
            body: {
                collectionName: 'testCollectionName',
                description: 'testDescription'
            }
        }
    });


    test('No errors should be returned if a valid request is passed', async () => {

        const errors = await collectionsValidator.validateCreateCollection(testRequest);

        expect(errors).toHaveLength(0);
    })

    describe('Collection Name Validation', () => {
        test('An error should be returned if no collection name is provided', async () => {
            testRequest.body.collectionName = '';

            const errors = await collectionsValidator.validateCreateCollection(testRequest);

            expect(errors).toHaveLength(1);
        })

        test('An error should be returned if a collection name made up of non-alphanumeric characters is provided', async () => {
            testRequest.body.collectionName = '%$$££$%^&%$£';

            const errors = await collectionsValidator.validateCreateCollection(testRequest);

            expect(errors).toHaveLength(1);
        })

        test('An error should be returned if a collection name longer than 30 characters is provided', async () => {
            testRequest.body.collectionName = 'qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmdfgdfgd';

            const errors = await collectionsValidator.validateCreateCollection(testRequest);

            expect(errors).toHaveLength(1);
        })
        
    });

    describe('Collection Description Validation', () => {
        test('No error should be returned if no collection description is provided', async () => {
            testRequest.body.description = '';

            const errors = await collectionsValidator.validateCreateCollection(testRequest);

            expect(errors).toHaveLength(0);
        })

        test('An error should be returned if a collection description longer than 50 characters is provided', async () => {
            testRequest.body.description = 'qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmdfgdfgdqwertyuiopasdfghsdfghjklzxcvbnmdfgdfgdqwertyuiopasdfghj';

            const errors = await collectionsValidator.validateCreateCollection(testRequest);

            expect(errors).toHaveLength(1);
        })

        test('An error should be returned if a collection description made up of numbers characters is provided', async () => {
            testRequest.body.description = '12344567890124';

            const errors = await collectionsValidator.validateCreateCollection(testRequest);

            expect(errors).toHaveLength(1);
        })        
    });


});
