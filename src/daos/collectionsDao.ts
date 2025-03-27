import { CollectionModel } from "../models/collections";
import Collection from '../models/collections';
import { MongoServerError } from 'mongodb';
import { spotifyAlbumData } from "../models/spotify";

export class CollectionsDao {

    async createCollection(collection: CollectionModel) {
        const userMdbObj = new Collection(collection);

        try {
            await userMdbObj.save();
        } catch (error) {
            if (error instanceof MongoServerError && error.code === 11000) {
                return 'A collection with this name already exists';
            } else {
                throw new Error(error as string);
            }            
        }
    }

    async getCollections(userID: string): Promise<CollectionModel[]> {
        try {
            return await Collection.find({ userID });
        } catch (error) {
            throw new Error(error as string);
        }
    }

    async getCollection(collectionId: string): Promise<CollectionModel> {
        try {
            const collection = await Collection.findById(collectionId);
            if (!collection) {
                throw new Error('Collection not found');
            }
            return collection;
        } catch (error) {
            throw new Error(error as string);
        }
    }

    async saveVinylToCollection(albumInfo: spotifyAlbumData, collectionID: string) {
        try {
            const collection = await Collection.findById(collectionID);
            if (!collection) {
                throw new Error('Collection not found');
            }
            collection.vinyls.push(albumInfo);
            await collection.save();

            return 'Vinyl saved to collection';

        } catch (error) {
            throw new Error(error as string);
        }
    }
        
}