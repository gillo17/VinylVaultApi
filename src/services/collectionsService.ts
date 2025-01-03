import { inject } from "inversify";
import { CollectionModel } from "../models/collections";
import Types from "../types";
import { CollectionsDao } from "../daos/collectionsDao";
import { CollectionsMapper } from "../mappers/collectionsMapper";

export class CollectionsService {

    constructor(
        @inject(Types.CollectionsDao) private collectionDao: CollectionsDao,
        @inject(Types.CollectionsMapper) private collectionMapper: CollectionsMapper
    ) {}

    public async createCollection(collection: CollectionModel) {

        return this.collectionDao.createCollection(collection);
    }

    public async getCollections(userID: string) {
        
        const collection = await this.collectionDao.getCollections(userID);

        return this.collectionMapper.mapCollectionToViewCollection(collection);
    }

}