import mongoose from "mongoose";
import Collections, { CollectionModel } from "../models/collections";

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
} 