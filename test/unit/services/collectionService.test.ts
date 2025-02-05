import { CollectionsDao } from '../../../src/daos/collectionsDao';
import Collection from '../../../src/models/collections';
import { CollectionsService } from '../../../src/services/collectionsService';
import { describe, expect, test, jest } from '@jest/globals';
import { CollectionsMapper } from '../../../src/mappers/collectionsMapper';
import { SpotifyMapper } from '../../../src/mappers/spotifyMapper';
import { SpotifyService } from '../../../src/services/spotifyService';


describe('Collection Service Tests', () => {
    
    const collectionsDao = new CollectionsDao();
    const collectionMapper = new CollectionsMapper();
    const spotifyMapper= new SpotifyMapper();
    const spotifyService = new SpotifyService();
    const collectionsService = new CollectionsService(collectionsDao, collectionMapper, spotifyService, spotifyMapper);

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
