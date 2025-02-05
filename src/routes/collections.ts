import container from '../inversify.config';
import Types from '../types';
import { CollectionsController } from '../controllers/collectionsController';
import express from 'express';

const router = express.Router();

const collectionController = container.get<CollectionsController>(Types.CollectionsController);

router.post('/createCollection', (req, res) => {
    collectionController.createCollection(req, res);
});

router.get('/getCollections', (req, res) => {
    collectionController.getCollections(req, res);
});

router.get('/getUrl', (req, res) => {
    collectionController.generatePresignedUrl(req, res);
});

router.post('/saveVinylToCollection', (req, res) => {
    collectionController.saveVinylToCollection(req, res);
});

router.get('/getCollectionInfo', (req, res) => {
    collectionController.getCollection(req, res);
});

router.post('/submitImageForTraining', (req, res) => {
    collectionController.addImageToTrainingData(req, res);
})

export = router;