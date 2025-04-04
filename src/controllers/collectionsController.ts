import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import Types from '../types';
import { CollectionsService } from '../services/collectionsService';
import { CollectionsMapper } from '../mappers/collectionsMapper';
import { CollectionsValidator } from '../validators/collectionsValidator';
import { saveVinylToCollectionModel, ViewCollectionModel } from '../models/collections';
import { AwsMapper } from '../mappers/awsMapper';
import { AwsService } from '../services/awsService';
import Logging from '../utils/Logging';

@injectable()
export class CollectionsController {

    constructor(
        @inject(Types.CollectionsService) private collectionService: CollectionsService,
        @inject(Types.CollectionsMapper) private collectionMapper: CollectionsMapper,
        @inject(Types.CollectionsValidator) private collectionValidator: CollectionsValidator,
        @inject(Types.AWSMapper) private awsMapper: AwsMapper,
        @inject(Types.AWSService) private awsService: AwsService,
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

    public generatePresignedUrl = async (
        req: Request,
        res: Response
    ): Promise<Response> => {

        const awsUrlRequest = await this.awsMapper.generatePresignedUrlRequest();

        const url  = await this.awsService.generatePresignedUrl(awsUrlRequest.command);

        if (!url) {
            return res.status(500).json({ error: 'Error generating url' });
        } else {
            return res.status(200).json({ 
                url: url,
                key: awsUrlRequest.fileKey
            });
        }
    }

    public addImageToTrainingData = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        try {

            const addImageToTrainingData = await this.awsMapper.mapRequestToAddImageToTraining(req);
            await this.awsService.addImageToTrainingData(addImageToTrainingData);
            return res.status(201).json({ artist: req.body.Artist, albumName: req.body.AlbumName });

        } catch (error) {
            Logging.error("Error: Adding Image to Training Data");
            Logging.error(error);
            return res.status(500).json({ error: error });
        }

    }

    public saveVinylToCollection = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        try {

            await this.collectionValidator.validateSaveToCollection(req);

            const collection: saveVinylToCollectionModel = await this.collectionMapper.mapRequestToSaveVinylToCollection(req);

            await this.collectionService.saveVinylToCollection(collection);

            return res.status(201).json({ message: 'Vinyl saved to collection' });
        
        } catch (error) {
            return res.status(500).json({ error: error });
        }
    
    }

    public getCollection = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        
        const collectionID = req.query.collectionID as string;

        const collection = await this.collectionService.getCollection(collectionID);

        if (collection) {
            return res.status(200).json(collection);
        } else {
            return res.status(500).json({ error: 'Error fetching collection' });
        }
    }
}