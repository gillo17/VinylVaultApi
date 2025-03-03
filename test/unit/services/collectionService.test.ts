import { CollectionsDao } from '../../../src/daos/collectionsDao';
import Collection, { saveVinylToCollectionModel } from '../../../src/models/collections';
import { CollectionsService } from '../../../src/services/collectionsService';
import { describe, expect, test, jest } from '@jest/globals';
import { CollectionsMapper } from '../../../src/mappers/collectionsMapper';
import { SpotifyMapper } from '../../../src/mappers/spotifyMapper';
import { SpotifyService } from '../../../src/services/spotifyService';
import { WishlistDao } from '../../../src/daos/wishlistDao';
import { mock } from 'node:test';


describe('Collection Service Tests', () => {
    
    const collectionsDao = new CollectionsDao();
    const collectionMapper = new CollectionsMapper();
    const spotifyMapper= new SpotifyMapper();
    const spotifyService = new SpotifyService();
    const wishlistDao = new WishlistDao();
    const collectionsService = new CollectionsService(collectionsDao, collectionMapper, spotifyService, spotifyMapper, wishlistDao);

    const testCollection = new Collection({
        _id: 'testId',
        collectionName: 'testCollectionName',
        description: 'testDescription',
        vinyls: [],
        userID: 'testUserID'
    });

    const mockAlbumData = {
        name: 'testName',
        artists: [{ name: 'testArtist' }],
        id: 'testID',
        images: [{ url: 'testURL' }]
    }

    test('createCollection is called when a collection is created', async () => {
        const createCollectionSpy = jest
            .spyOn(collectionsDao, 'createCollection')
            .mockResolvedValue(undefined);

        collectionsService.createCollection(testCollection);

        expect(createCollectionSpy).toHaveBeenCalledWith(testCollection);
    })

    test("save vinyl to collection to be called when a vinyl is added", async () => {
        const mockSaveVinylToCollection : saveVinylToCollectionModel = {
            spotifyAlbumID: 'testID',
            collectionID: 'testCollectionID',
            userId: 'testUserID'
        }

        const saveToCollectionSpy = jest
            .spyOn(collectionsDao, 'saveVinylToCollection')
            .mockResolvedValue("saved");

        const checkWishlistSpy = jest
            .spyOn(wishlistDao, 'searchAlbumInWishlist')
            .mockResolvedValue(false);

        const getAlbumDataSpy = jest
            .spyOn(spotifyService, 'getAlbumInfo')
            .mockResolvedValue(mockAlbumData);

        await collectionsService.saveVinylToCollection(mockSaveVinylToCollection);

        expect(saveToCollectionSpy).toHaveBeenCalled();
        expect(checkWishlistSpy).toHaveBeenCalledWith(mockSaveVinylToCollection.userId, mockAlbumData.id);
        expect(getAlbumDataSpy).toHaveBeenCalled();
    
    })

        test("remove vinyl from wishlist should be called if vinyl to be added is in the wishlist", async () => {
        const mockSaveVinylToCollection : saveVinylToCollectionModel = {
            spotifyAlbumID: 'testID',
            collectionID: 'testCollectionID',
            userId: 'testUserID'
        }

        const saveToCollectionSpy = jest
            .spyOn(collectionsDao, 'saveVinylToCollection')
            .mockResolvedValue("saved");

        const checkWishlistSpy = jest
            .spyOn(wishlistDao, 'searchAlbumInWishlist')
            .mockResolvedValue(true);

        const removeAlbumfromWishlistSpy = jest
            .spyOn(wishlistDao, 'removeAlbumfromWishlist')
            .mockImplementation(() => Promise.resolve(true));

        const getAlbumDataSpy = jest
            .spyOn(spotifyService, 'getAlbumInfo')
            .mockResolvedValue(mockAlbumData);

        await collectionsService.saveVinylToCollection(mockSaveVinylToCollection);

        expect(saveToCollectionSpy).toHaveBeenCalled();
        expect(removeAlbumfromWishlistSpy).toHaveBeenCalled();
        expect(checkWishlistSpy).toHaveBeenCalledWith(mockSaveVinylToCollection.userId, mockAlbumData.id);
        expect(getAlbumDataSpy).toHaveBeenCalled();
    
    })


});
