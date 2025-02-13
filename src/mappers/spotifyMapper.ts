import { spotifyAlbumData } from "../models/spotify";

export class SpotifyMapper {

    public async mapSpotifyAlbumData(spotifyRes: any): Promise<spotifyAlbumData>  {

        const spotifyData = {
            albumName: spotifyRes.name,
            artist: spotifyRes.artists[0].name,
            spotifyID: spotifyRes.id,
            albumImage: spotifyRes.images[0].url,
            spotifyArtistID: spotifyRes.artists[0].uri,
        }
        return spotifyData;
        
    }
}