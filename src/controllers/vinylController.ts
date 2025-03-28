import { DetectCustomLabelsCommandInput } from "@aws-sdk/client-rekognition";
import { inject, injectable } from "inversify";
import Logging from "../utils/Logging";
import { Request, Response } from 'express';
import Types from "../types";
import { AwsMapper } from "../mappers/awsMapper";
import { AwsService } from "../services/awsService";
import { searchForVinylModel } from "../models/collections";
import { CollectionsMapper } from "../mappers/collectionsMapper";
import { SpotifyService } from "../services/spotifyService";
import { OpenAIService } from "../services/openAIService";
import { VinylService } from "../services/vinylService";
import { spotifyAlbumData } from "../models/spotify";
import { VinylMapper } from "../mappers/vinylMapper";

@injectable()
export class VinylController {

    constructor(
        @inject(Types.AWSService) private awsService: AwsService,
        @inject(Types.AWSMapper) private awsMapper: AwsMapper,
        @inject(Types.CollectionsMapper) private collectionMapper: CollectionsMapper,
        @inject(Types.SpotifyService) private spotifyService: SpotifyService,
        @inject(Types.OpenAIService) private openAIService: OpenAIService,
        @inject(Types.VinylService) private vinylService: VinylService,
        @inject(Types.VinylMapper) private vinylMapper: VinylMapper
    ) {}

    public identifyVinyl = async (
        req: Request,
        res: Response
    ): Promise<Response> => {

        const awsImageInterface: DetectCustomLabelsCommandInput = await this.awsMapper.mapRequestToAWSImageInterface(req);

        const result  = await this.awsService.identifyVinyl(awsImageInterface);
        Logging.info(result);


        if (result && result.length === 2 && result[0] && result[1]) {
            return res.status(200).json({album: result[0], artist: result[1], message: "Vinyl Identified"});
        } else {
            return res.status(200).json({ message: 'Vinyl Not Identified' });
        }
    }

    public searchVinyl = async (
        req: Request,
        res: Response
    ): Promise<Response> => {

        const artist = req.query.artist as string;
        const album = req.query.album as string;

        const searchData: searchForVinylModel = await this.collectionMapper.mapRequestToSearchForVinyl(artist, album);

        const albumResults = await this.spotifyService.searchForAlbums(searchData);

        if (albumResults) {
            return res.status(200).json(albumResults);
        } else {
            return res.status(500).json({ error: 'Error fetching album' });
        }
    }

    public getVinylInfo = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        
        const vinylID = req.query.vinylID as string;

        const albumInfo = await this.spotifyService.getAlbumInfo(vinylID);
        const albumBackground = await this.openAIService.generateVinylBackground(albumInfo.name, albumInfo.artists[0].name);

        if (albumInfo) {
            return res.status(200).json({albumInfo, albumBackground});
        } else {
            return res.status(500).json({ error: 'Error fetching vinyl' });
        }
    }

    public searchVinylWishlist = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        
        try {
            const queryString = req.query.queryString as string;

            const albums = await this.vinylService.searchForVinyl(queryString);

            if (albums) {
                return res.status(200).json({albums});
            } else {
                return res.status(200).json({ error: 'No Vinyls Found' });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Error fetching vinyl' });
        }
    }

    public saveToWishlist = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        
        try {
            const albumId = req.query.albumId as string;
            const userID = req.body.user._id;

            const saveToWishlist = await this.vinylMapper.mapRequestToWishlist(albumId, userID);

            await this.vinylService.saveToWishlist(saveToWishlist);

            return res.status(200).json({ message: 'Vinyl saved to wishlist' });

        } catch (error) {
            return res.status(500).json({ error: `Error: ${error}`});
        }
    }

    public getAlbumsInWishlist = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        
        try {
            const userID = req.body.user._id;

            const wishlist = await this.vinylService.getAlbumsInWishlist(userID);

            return res.status(200).json({ albums: wishlist });

        } catch (error) {
            Logging.error(error);
            return res.status(500).json({ error: `Error: ${error}`});
        }
    }

    public getRecommendedAlbums = async (
        req: Request,
        res: Response
    ): Promise<Response> => {

        const collectionId = req.query.collectionId as string;

        const recommendedAlbums: spotifyAlbumData[] = await this.vinylService.getRecommendedVinyls(collectionId);

        if (recommendedAlbums) {
            return res.status(200).json(recommendedAlbums);
        } else {
            return res.status(500).json({ error: 'Error fetching recommended albums' });
        }
    }

}