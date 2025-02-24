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

        test('Should map array spotify request to array of spotifyAlbumData', async () => {
            const req = [
                {
                    name: 'testName',
                    artists: [{ name: 'testArtist' }],
                    id: 'testID',
                    images: [{ url: 'testURL' }]
                },
                {
                    name: 'testName2',
                    artists: [{ name: 'testArtist2' }],
                    id: 'testID2',
                    images: [{ url: 'testURL2' }]
                }
            ];

            const result = await spotifyMapper.mapSpotifyAlbumDataArray(req);

            expect(result[0].albumName).toBe('testName');
            expect(result[0].artist).toBe('testArtist');
            expect(result[0].spotifyID).toBe('testID');
            expect(result[0].albumImage).toBe('testURL');

            expect(result[1].albumName).toBe('testName2');
            expect(result[1].artist).toBe('testArtist2');
            expect(result[1].spotifyID).toBe('testID2');
            expect(result[1].albumImage).toBe('testURL2');
        });



    });
});