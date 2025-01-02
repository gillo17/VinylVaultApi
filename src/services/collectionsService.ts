import { inject } from "inversify";
import { CollectionModel } from "../models/collections";
import Types from "../types";
import { CollectionsDao } from "../daos/collectionsDao";

export class CollectionsService {

    constructor(
        @inject(Types.CollectionsDao) private collectionDao: CollectionsDao,
    ) {}

    public async createCollection(collection: CollectionModel) {

        return this.collectionDao.createCollection(collection);
    }

}