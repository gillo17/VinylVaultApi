import mongoose, { Schema, Document } from 'mongoose';

export interface CollectionModel {
    collectionName: string;
    description?: string;
    vinyls: [];
    userID: string;
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