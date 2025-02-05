import { describe, expect, test, jest } from '@jest/globals';
import { SpotifyMapper } from '../../../src/mappers/spotifyMapper';

describe('Spotify Mapper Tests', () => {
    const spotifyMapper = new SpotifyMapper();

    describe('Map Album Info to spotifyAlbumData', () => {
        test('Should map spotify request to spotifyAlbumData interface', async () => {
            const req = {
                name: 'testName',
                artists: [{ name: 'testArtist' }],
                id: 'testID',
                images: [{ url: 'testURL' }]
            };

            const result = await spotifyMapper.mapSpotifyAlbumData(req);

            expect(result.albumName).toBe('testName');
            expect(result.artist).toBe('testArtist');
            expect(result.spotifyID).toBe('testID');
            expect(result.albumImage).toBe('testURL');
        });

    });
});