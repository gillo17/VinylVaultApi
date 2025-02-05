import mongoose, { Schema, Document } from 'mongoose';
import { spotifyAbumData } from './spotify';

export interface CollectionModel {
    collectionName: string;
    description?: string;
    vinyls: spotifyAbumData[];
    userID: string;
}

export interface ViewCollectionModel {
    id: string;
    collectionName: string;
}

export interface searchForVinylModel {
    artist: string;
    albumName: string;
}

export interface saveVinylToCollectionModel {
    spotifyAlbumID: string;
    collectionID: string;
}

export interface CollectionModel extends Document {}

const CollectionsSchema: Schema = new Schema(
    {
        collectionName: { type: String, required: true, unique: true },
        description: { type: String },
        vinyls: [],
        userID: { type: String, required: true }
    },

    {
        versionKey: false,
    }
);

export default mongoose.model<CollectionModel>('Collections', CollectionsSchema);