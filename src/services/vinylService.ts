import { inject, injectable } from "inversify";
import Types from "../types";
import { CollectionsDao } from "../daos/collectionsDao";
import { CollectionModel } from "../models/collections";
import { SpotifyService } from "./spotifyService";
import { OpenAIService } from "./openAIService";
import { SpotifyMapper } from "../mappers/spotifyMapper";
import { spotifyAlbumData } from "../models/spotify";

@injectable()
export class VinylService {

    constructor(
        @inject(Types.CollectionsDao) private collectionDao: CollectionsDao,
        @inject(Types.SpotifyService) private spotifyService: SpotifyService,
        @inject(Types.OpenAIService) private openAIService: OpenAIService,
        @inject(Types.SpotifyMapper) private spotifyMapper: SpotifyMapper
    ) {}
    
    async getRecommendedVinyls(collectionId: string): Promise<spotifyAlbumData[]> {

        const collection: CollectionModel  = await this.collectionDao.getCollection(collectionId);
        
        const suggestedAlbums: spotifyAlbumData[] = [];

        const artistsInCollection = collection.vinyls.map(vinyl => vinyl.spotifyArtistID.slice(15, vinyl.spotifyArtistID.length));

        const spotifyRes = await this.spotifyService.getArtistsInfo(artistsInCollection.join(","));

        const genresInCollection = spotifyRes.artists.map((artist: { genres: any; }) => artist.genres).flat();

        const averageGenres = this.getMostUsedGenres((genresInCollection))

        const recommendedAlbums = await this.openAIService.generateRecommendedAlbums(averageGenres.join(","));

        const fixedJsonString = recommendedAlbums.slice(7, recommendedAlbums.length - 3)

        const albums = JSON.parse(fixedJsonString).map((album: { album: string; artist: string; }) => ({
            albumName: album.album,
            artist: album.artist
        }));

        for (const album of albums) {
            const albumInfo = await this.spotifyService.searchForAlbums(album);

            if (albumInfo[0]) {
                const mappedAlbumInfo: spotifyAlbumData = await this.spotifyMapper.mapSpotifyAlbumData(albumInfo[0]);
                suggestedAlbums.push(mappedAlbumInfo);
            } else {
                continue;
            }
        }

        const filteredAlbums = suggestedAlbums.filter(
            (album) => !collection.vinyls.some(
                (remove) => remove.artist === album.artist && remove.albumName === album.albumName
            )
        );

        return filteredAlbums;
   }

    private getMostUsedGenres(genres: string[]): string[] {
        if (genres.length === 0) return [];

        const genreCount: Record<string, number> = {};
        for (const genre of genres) {
            genreCount[genre] = (genreCount[genre] || 0) + 1;
        }

        const sortedGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]);

        return sortedGenres.map(([genre]) => genre);
    };

}