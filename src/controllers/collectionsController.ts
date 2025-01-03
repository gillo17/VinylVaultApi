import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import Types from '../types';
import { CollectionsService } from '../services/collectionsService';
import { CollectionsMapper } from '../mappers/collectionsMapper';
import { CollectionsValidator } from '../validators/collectionsValidator';
import { CollectionModel, ViewCollectionModel } from '../models/collections';

@injectable()
export class CollectionsController {

    constructor(
        @inject(Types.CollectionsService) private collectionService: CollectionsService,
        @inject(Types.CollectionsMapper) private collectionMapper: CollectionsMapper,
        @inject(Types.CollectionsValidator) private collectionValidator: CollectionsValidator
    ) {}
    public createCollection = async (
        req: Request,
        res: Response,
    ): Promise<Response> => {

        const errors = await this.collectionValidator.validateCreateCollection(req);

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const collection = await this.collectionMapper.mapRequestToCollection(req);

        const result =  await this.collectionService.createCollection(collection);

        if (!result) {
            return res.status(201).json({ message: 'Collection created' });
        } else {
            return res.status(500).json({ error: result });
        }
    }

    public getCollections = async (
        req: Request,
        res: Response,
    ): Promise<Response> => {
        
        const userID = req.body.user._id;

        const collections: ViewCollectionModel[] = await this.collectionService.getCollections(userID);

        if (collections) {
            return res.status(200).json(collections);
        } else {
            return res.status(500).json({ error: 'Error fetching collections' });
        }
    }

}