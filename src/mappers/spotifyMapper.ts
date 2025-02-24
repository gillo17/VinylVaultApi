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

    public async mapSpotifyAlbumDataArray(spotifyRes: any[]): Promise<spotifyAlbumData[]>  {

        const spotifyData: spotifyAlbumData[] = [];

        for (const album of spotifyRes) {
            const albumData = {
                albumName: album.name,
                artist: album.artists[0].name,
                spotifyID: album.id,
                albumImage: album.images[0].url,
                spotifyArtistID: album.artists[0].uri,
            }
            spotifyData.push(albumData);
        }
        return spotifyData;
        
    }
}