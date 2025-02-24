import { inject, injectable } from "inversify";
import Types from "../types";
import { CollectionsDao } from "../daos/collectionsDao";
import { CollectionModel, searchForVinylModel } from "../models/collections";
import { SpotifyService } from "./spotifyService";
import { OpenAIService } from "./openAIService";
import { SpotifyMapper } from "../mappers/spotifyMapper";
import { spotifyAlbumData } from "../models/spotify";
import { saveVinylToWishlistModel } from "../models/wishlist";
import { WishlistDao } from "../daos/wishlistDao";
import mongoose, { ObjectId } from "mongoose";
import Logging from "../utils/Logging";

@injectable()
export class VinylService {

    constructor(
        @inject(Types.CollectionsDao) private collectionDao: CollectionsDao,
        @inject(Types.SpotifyService) private spotifyService: SpotifyService,
        @inject(Types.OpenAIService) private openAIService: OpenAIService,
        @inject(Types.SpotifyMapper) private spotifyMapper: SpotifyMapper,
        @inject(Types.WishlistDao) private wishlistDao: WishlistDao
    ) {}
    
    async getRecommendedVinyls(collectionId: string): Promise<spotifyAlbumData[]> {

        const collection: CollectionModel  = await this.collectionDao.getCollection(collectionId);
        
        const suggestedAlbums: spotifyAlbumData[] = [];

        const artistsInCollection = collection.vinyls.map(vinyl => vinyl.spotifyArtistID.slice(15, vinyl.spotifyArtistID.length));

        const spotifyRes = await this.spotifyService.getArtistsInfo(artistsInCollection.join(","));

        const genresInCollection = spotifyRes.artists.map((artist: { genres: any; }) => artist.genres).flat();

        const averageGenres = this.getMostUsedGenres((genresInCollection))

        const recommendedAlbums = await this.openAIService.generateRecommendedAlbums(averageGenres.join(","));

        const fixedJsonString = recommendedAlbums.slice(7, recommendedAlbums.length - 3)

        const albums = JSON.parse(fixedJsonString).map((album: { album: string; artist: string; }) => ({
            albumName: album.album,
            artist: album.artist
        }));

        for (const album of albums) {
            const albumInfo = await this.spotifyService.searchForAlbums(album);

            if (albumInfo[0]) {
                const mappedAlbumInfo: spotifyAlbumData = await this.spotifyMapper.mapSpotifyAlbumData(albumInfo[0]);
                suggestedAlbums.push(mappedAlbumInfo);
            } else {
                continue;
            }
        }

        const filteredAlbums = suggestedAlbums.filter(
            (album) => !collection.vinyls.some(
                (remove) => remove.artist === album.artist && remove.albumName === album.albumName
            )
        );

        return filteredAlbums;
   }

   async searchForVinyl(queryString: string): Promise<spotifyAlbumData[]> {
        const query: searchForVinylModel = this.parseQuery(queryString);

        const searchForVinyl = await this.spotifyService.searchForAlbums(query);

        const mappedVinyls = await this.spotifyMapper.mapSpotifyAlbumDataArray(searchForVinyl);

        return mappedVinyls;
   }

    async getAlbumsInWishlist(userId: string): Promise<spotifyAlbumData[]> {
        const wishlistInfo = await this.wishlistDao.getWishlist(userId);
        if (!wishlistInfo) return [];

        return wishlistInfo.albums;
   }

   async saveToWishlist(saveToWishlist : saveVinylToWishlistModel) {

        const albumInfo = await this.spotifyService.getAlbumInfo(saveToWishlist.spotifyAlbumID);
        const mappedAlbumInfo: spotifyAlbumData = await this.spotifyMapper.mapSpotifyAlbumData(albumInfo);
        
        const wishlistInfo = await this.wishlistDao.getWishlist(saveToWishlist.userID);

        if (wishlistInfo) {
            this.wishlistDao.saveVinylToWishlist(mappedAlbumInfo, wishlistInfo._id);
        } else {
            const session = await mongoose.startSession();
            try {
                session.startTransaction();
                const wishlistId = await this.wishlistDao.createWishlist(saveToWishlist.userID);
                this.wishlistDao.saveVinylToWishlist(mappedAlbumInfo, wishlistId);
                await session.commitTransaction();
            } catch (error) {
                throw new Error(error as string);
            } finally {
                session.endSession();
            }

        }
   }
   
   private parseQuery(query: string) {
        query = query.trim();

        const dashMatch = query.match(/^(.+?)\s*-\s*(.+)$/);
        if (dashMatch) {
            return { artist: dashMatch[1].trim(), albumName: dashMatch[2].trim() };
        }

        const byMatch = query.match(/^(.+?)\s+by\s+(.+)$/i);
        if (byMatch) {
            return { albumName: byMatch[1].trim(), artist: byMatch[2].trim() };
        }

        const singleMatch = query.match(/^(.+)$/);
        if (singleMatch) {
            return { artist: singleMatch[1].trim() , albumName: "" };
        }
        
        return { artist: "", albumName: query };
    }



    private getMostUsedGenres(genres: string[]): string[] {
        if (genres.length === 0) return [];

        const genreCount: Record<string, number> = {};
        for (const genre of genres) {
            genreCount[genre] = (genreCount[genre] || 0) + 1;
        }

        const sortedGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]);

        return sortedGenres.map(([genre]) => genre);
    };

}