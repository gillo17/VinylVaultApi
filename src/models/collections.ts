import mongoose, { Schema, Document } from 'mongoose';
import { spotifyAlbumData } from './spotify';

export interface CollectionModel {
    collectionName: string;
    description?: string;
    vinyls: spotifyAlbumData[];
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
    userId: string;
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