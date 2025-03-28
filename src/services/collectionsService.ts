import { inject } from "inversify";
import { CollectionModel, saveVinylToCollectionModel } from "../models/collections";
import Types from "../types";
import { CollectionsDao } from "../daos/collectionsDao";
import { CollectionsMapper } from "../mappers/collectionsMapper";
import { SpotifyService } from "./spotifyService";
import { SpotifyMapper } from "../mappers/spotifyMapper";
import { spotifyAlbumData } from "../models/spotify";
import { WishlistDao } from "../daos/wishlistDao";

export class CollectionsService {

    constructor(
        @inject(Types.CollectionsDao) private collectionDao: CollectionsDao,
        @inject(Types.CollectionsMapper) private collectionMapper: CollectionsMapper,
        @inject(Types.SpotifyService) private spotifyService: SpotifyService,
        @inject(Types.SpotifyMapper) private spotifyMapper: SpotifyMapper,
        @inject(Types.WishlistDao) private wishlistDao: WishlistDao
    ) {}

    public async createCollection(collection: CollectionModel) {

        return this.collectionDao.createCollection(collection);
    }

    public async getCollections(userID: string) {
        
        const collection = await this.collectionDao.getCollections(userID);

        return this.collectionMapper.mapCollectionToViewCollection(collection);
    }

    public async getCollection(collectionID: string) {
        
        return await this.collectionDao.getCollection(collectionID);
    }

    public async saveVinylToCollection(data: saveVinylToCollectionModel) {

        const albumInfo = await this.spotifyService.getAlbumInfo(data.spotifyAlbumID);

        const mappedAlbumInfo: spotifyAlbumData = await this.spotifyMapper.mapSpotifyAlbumData(albumInfo);

        const existsInWishlist = await this.wishlistDao.searchAlbumInWishlist(data.userId, data.spotifyAlbumID);

        if (existsInWishlist) {
            await this.wishlistDao.removeAlbumfromWishlist(data.userId, data.spotifyAlbumID)
        }

        this.collectionDao.saveVinylToCollection(mappedAlbumInfo, data.collectionID);
    }

}