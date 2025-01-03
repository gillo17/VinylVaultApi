import express from 'express';
import container from '../inversify.config';
import Types from '../types';
import { CollectionsController } from '../controllers/collectionsController';

const router = express.Router();

const collectionController = container.get<CollectionsController>(Types.CollectionsController);

router.post('/createCollection', (req, res) => {
    collectionController.createCollection(req, res);
});

router.get('/getCollections', (req, res) => {
    collectionController.getCollections(req, res);
});

export = router;