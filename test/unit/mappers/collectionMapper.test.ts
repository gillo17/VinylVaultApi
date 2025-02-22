import { describe, expect, test, jest } from '@jest/globals';
import { CollectionsMapper } from '../../../src/mappers/collectionsMapper';
import mongoose from "mongoose";
import Collections, { CollectionModel, saveVinylToCollectionModel, searchForVinylModel, ViewCollectionModel } from "../../../src/models/collections";

describe('Collection Mapper Tests', () => {
    const collectionsMapper = new CollectionsMapper();

    const testRequest = {
        body: {
            collectionName: "Test2",
            collectionDescription: "test description",
            user: {
                _id: "1"
            }
        },
    };

    describe('Map a Request to Collecion Interface', () => {

        test('Map a Request to Collecion Interface', async () => {
            const collection = await collectionsMapper.mapRequestToCollection(testRequest);

            expect(collection.collectionName).toBe(testRequest.body.collectionName);
            expect(collection.description).toBe(testRequest.body.collectionDescription);
            expect(collection.userID).toBe(testRequest.body.user._id);
            expect(collection.vinyls).toStrictEqual([]);
        });
    });

    describe("Map Collection to View Collection", () => {
        test('Map Collection to View Collection', async () => {
            
            const collectionModel: CollectionModel = new Collections({
                _id: "1",
                collectionName: "Test2",
                description: "test description",
                vinyls: [],
                userID: "1"
            })
            
            const collection: CollectionModel[] = [collectionModel];

            const viewCollection: ViewCollectionModel[] = await collectionsMapper.mapCollectionToViewCollection(collection);

            expect(viewCollection[0].id).toBe(collection[0]._id);
            expect(viewCollection[0].collectionName).toBe(collection[0].collectionName);

        });
    });

    describe("Map Request to Save vinyl Request", () => {
        test('Map request to saveVinylToCollectionModel', async () => {

            const testRequest = {
                body: {
                    VinylID: "1",
                    collectionID: "1"
                }
            }
            
            const viewCollection: saveVinylToCollectionModel = await collectionsMapper.mapRequestToSaveVinylToCollection(testRequest);

            expect(viewCollection.collectionID).toBe(testRequest.body.collectionID);
            expect(viewCollection.spotifyAlbumID).toBe(testRequest.body.VinylID);

        });
    });

    describe("Map Request to Search for Vinyl", () => {
        test("Map Request to Search for Vinyl", async () => {
            const artist = "test";
            const album = "test";

            const searchForVinyl: searchForVinylModel = await collectionsMapper.mapRequestToSearchForVinyl(artist, album);

            expect(searchForVinyl.artist).toBe(artist);
            expect(searchForVinyl.albumName).toBe(album);
        });
    });

});
