import { CollectionsDao } from '../../../src/daos/collectionsDao';
import Collection from '../../../src/models/collections';
import { CollectionsService } from '../../../src/services/collectionsService';
import { describe, expect, test, jest } from '@jest/globals';

describe('Collection Service Tests', () => {
    
    const collectionsDao = new CollectionsDao();
    const collectionsService = new CollectionsService(collectionsDao);

    const testCollection = new Collection({
        _id: 'testId',
        collectionName: 'testCollectionName',
        description: 'testDescription',
        vinyls: [],
        userID: 'testUserID'
    });

    test('createCollection is called when a collection is created', async () => {
        const createCollectionSpy = jest
            .spyOn(collectionsDao, 'createCollection')
            .mockResolvedValue(undefined);

        collectionsService.createCollection(testCollection);

        expect(createCollectionSpy).toHaveBeenCalledWith(testCollection);
    })


});
