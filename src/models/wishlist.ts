import mongoose, { Document, ObjectId, Schema } from "mongoose";
import { spotifyAlbumData } from "./spotify";

export interface saveVinylToWishlistModel {
    spotifyAlbumID: string;
    userID: string;
}

export interface ViewWishlistModel {
    albums: spotifyAlbumData[];
    userID: string;
    _id: string;
}

export interface WishlistModel {
    _id: string;
    albums: spotifyAlbumData[];
    userID: string;
}

const WishlistSchema: Schema = new Schema(
    {
        albums: [{ type: Object, required: true }],
        userID: { type: String, required: true }
    },
    {
        versionKey: false,
    }
);

export default mongoose.model<WishlistModel>('Wishlist', WishlistSchema);