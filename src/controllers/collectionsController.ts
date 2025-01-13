import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import Types from '../types';
import { CollectionsService } from '../services/collectionsService';
import { CollectionsMapper } from '../mappers/collectionsMapper';
import { CollectionsValidator } from '../validators/collectionsValidator';
import { ViewCollectionModel } from '../models/collections';
import { AwsMapper } from '../mappers/awsMapper';
import { AwsService } from '../services/awsService';
import Rekognition from 'aws-sdk/clients/rekognition';
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

    public identifyVinyl = async (
        req: Request,
        res: Response
    ): Promise<Response> => {

        console.log(req.body.formData._parts[0][1]);

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const awsImageInterface: Rekognition.Types.DetectCustomLabelsRequest = await this.awsMapper.mapRequestToAWSImageInterface(req);

        const result  = await this.awsService.identifyVinyl(awsImageInterface);
        Logging.info(result);

        if (!result) {
            return res.status(404).json({ error: 'Error identifying vinyl' });
        } else if (result.length === 2) {
            return res.status(200).json({ artist: result[0], album: result[1] });
        }

        return res.status(500).json({ message: 'An Error Has Occurred' });
    }
}