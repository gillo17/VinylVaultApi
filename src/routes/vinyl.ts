import container from '../inversify.config';
import Types from '../types';
import multer from 'multer';
import express, { Request, Response } from 'express';
import { VinylController } from '../controllers/vinylController';

const router = express.Router();

const upload = multer();

const vinylController = container.get<VinylController>(Types.VinylController);

router.post('/identifyVinyl', upload.single('file'), (req: Request, res: Response) => {
    vinylController.identifyVinyl(req, res);
});

router.get('/getVinylInfo', (req, res) => {
    vinylController.getVinylInfo(req, res);
});

router.get('/searchVinyl', (req, res) => {
    vinylController.searchVinyl(req, res);
});

router.get('/getRecommendations', (req, res) => {
    vinylController.getRecommendedAlbums(req, res);
});

router.get('/searchVinylWishlist', (req, res) => {
    vinylController.searchVinylWishlist(req, res);
});

router.post('/saveVinylToWishlist', (req, res) => {
    vinylController.saveToWishlist(req, res);
});

export = router;