import Wishlist, {        ViewWishlistModel, WishlistModel } from '../models/wishlist';
import { MongoServerError } from 'mongodb';
import { spotifyAlbumData } from "../models/spotify";

export class WishlistDao {

    async createWishlist(userID: string): Promise<string> {
        const wishlist = new Wishlist({
            userID,
            albums: []
        });

        try {
            await wishlist.save();
            return wishlist._id;
        } catch (error) {
            if (error instanceof MongoServerError && error.code === 11000) {
                return 'A collection with this name already exists';
            } else {
                throw new Error(error as string);
            }            
        }
    }

    async getWishlist(userID: string): Promise<WishlistModel | null> {
        try {
            const wishlist =  await Wishlist.findOne({ userID });
            if (!wishlist) {
                return null;
            }
            return wishlist;
        } catch (error) {
            throw new Error(error as string);
        }
    }

    async searchAlbumInWishlist(userId: string, albumId: string): Promise<boolean> {
        try {
            const wishlist =  await Wishlist.findOne({ userId });
            if (!wishlist) {
                throw new Error("Error fetching wishlist");
            }
            for (const album of wishlist.albums) {
                if (album.spotifyID === albumId) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            throw new Error(error as string);
        }
    }

    async removeAlbumfromWishlist(userId: string, albumId: string) {
        try {
            const wishlist =  await Wishlist.findOne({ userId });
            if (!wishlist) {
                throw new Error("Error fetching wishlist");
            }
            const albumIndex = wishlist.albums.findIndex(album => album.spotifyID === albumId);
            if (albumIndex !== -1) {
                wishlist.albums.splice(albumIndex, 1);
                await wishlist.save();
            }
            return false;
        } catch (error) {
            throw new Error(error as string);
        }
    }

    async saveVinylToWishlist(albumInfo: spotifyAlbumData, wishlistId: string) {
        try {
            const wishlist = await Wishlist.findById(wishlistId);
            if (!wishlist) {
                throw new Error('Collection not found');
            }
            wishlist.albums.push(albumInfo);
            await wishlist.save();

            return 'Vinyl saved to collection';

        } catch (error) {
            throw new Error(error as string);
        }
    }
        
}