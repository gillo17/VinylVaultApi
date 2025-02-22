import axios from 'axios';
import qs from 'qs';
import { searchForVinylModel } from '../models/collections';
import Logging from '../utils/Logging';

let Token: string;
let t2Refresh: Date | null = null;

export class SpotifyService {

    public async searchForAlbums(searchData: searchForVinylModel) {
        const token = await this.getSpotifyToken()

        const response = await axios.get(`https://api.spotify.com/v1/search?q=album:${searchData.albumName}%20artist:${searchData.artist}&type=album`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return response.data.albums.items

    }

        
    public async getAlbumInfo(albumID: string) {
        const token = await this.getSpotifyToken()

        const response = await axios.get(`https://api.spotify.com/v1/albums/${albumID}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return response.data

    }

    public async getArtistsInfo(artists: string) {
        const token = await this.getSpotifyToken()

        const response = await axios.get(`https://api.spotify.com/v1/artists?ids=${artists}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return response.data
    }

    private async getSpotifyToken() {

        if (!t2Refresh || t2Refresh.getTime() <= Date.now() || !Token) {

            Logging.info('Getting new spotify token')

            const headers = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                auth: {
                    username: process.env.SPOTIFY_API_ID || '',
                    password: process.env.SPOTIFY_API_SECRET || '',
                },
            };

            const data = {
                grant_type: 'client_credentials',
            };

            const response = await axios.post('https://accounts.spotify.com/api/token', qs.stringify(data), headers);

            Token = response.data.access_token;

            const currentTime = Date.now();
            const expiresIn = response.data.expires_in * 1000;
            t2Refresh = new Date(currentTime + expiresIn);

            return Token;

        } else {
            return Token
        }
    }



}