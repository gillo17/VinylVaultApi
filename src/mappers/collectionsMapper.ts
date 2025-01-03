import mongoose from "mongoose";
import Collections, { CollectionModel, ViewCollectionModel } from "../models/collections";

export class CollectionsMapper {

    public async mapRequestToCollection(req: any): Promise<CollectionModel> {

        const collectionName = req.body.collectionName;
        const description = req.body.collectionDescription;
        const userID = req.body.user._id;
        const collection: CollectionModel = new Collections({
            _id: new mongoose.Types.ObjectId(),
            collectionName,
            description,
            vinyls: [],
            userID
        });

        return collection;
    }

    public async mapCollectionToViewCollection(collection: CollectionModel[]): Promise<ViewCollectionModel[]> {
        
        const collections: ViewCollectionModel[] = [];

        for (let i = 0; i < collection.length; i++) {

            const viewCollection: ViewCollectionModel = {
                id: collection[i]._id as string,
                collectionName: collection[i].collectionName
            };
            collections.push(viewCollection);
        }
        return collections;
    }
} 