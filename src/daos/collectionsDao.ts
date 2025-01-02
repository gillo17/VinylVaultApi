import { CollectionModel } from "../models/collections";
import Collection from '../models/collections';
import { MongoServerError } from 'mongodb';

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
}