import mongoose from "mongoose";
import Collections, { CollectionModel, ViewCollectionModel, saveVinylToCollectionModel, searchForVinylModel } from "../models/collections";

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

    public async mapRequestToSaveVinylToCollection(req: any): Promise<saveVinylToCollectionModel> {

        const data: saveVinylToCollectionModel = {
            spotifyAlbumID: req.body.VinylID,
            collectionID: req.body.collectionID,    
            userId: req.body.user._id
        }

        return data;
    }

    public async mapRequestToSearchForVinyl(artist: string, album: string): Promise<searchForVinylModel> {
        
        const data: searchForVinylModel = {
            artist: artist,
            albumName: album
        }

        return data;
    }
} 