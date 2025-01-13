import express from 'express';
import container from '../inversify.config';
import Types from '../types';
import { CollectionsController } from '../controllers/collectionsController';
import multer from 'multer';

const router = express.Router();

const upload = multer()

const collectionController = container.get<CollectionsController>(Types.CollectionsController);

router.post('/createCollection', (req, res) => {
    collectionController.createCollection(req, res);
});

router.get('/getCollections', (req, res) => {
    collectionController.getCollections(req, res);
});

router.post('/identifyVinyl', upload.single('file'), (req, res) => {
    collectionController.identifyVinyl(req, res);
});

export = router;