import { describe, expect, test } from '@jest/globals';
import { AwsMapper } from '../../../src/mappers/awsMapper';

describe('AWS Mapper Tests', () => {
    const awsMapper = new AwsMapper();

    describe('Map Request to Rekognition Detect Model', () => {
        test('Should map request to AWS Image Interface', async () => {
            const req = {
                body: {
                    key: 'testKey'
                }
            };
            const result = await awsMapper.mapRequestToAWSImageInterface(req);
            expect(result).toEqual({
                Image: {
                    S3Object: {
                        Bucket: '',
                        Name: 'testKey'
                    }
                },
                MinConfidence: 70.0,
                ProjectVersionArn: ''
            });
        });

    });

    describe('Map Request to Add Image to Training data', () => {
        test('Should map request to Add Image to Training data', async () => {
            const req = {
                body: {
                    s3Key: 's3Key',
                    Artist: 'Artist',
                    AlbumName: 'AlbumName'
                }
            }
            const result = await awsMapper.mapRequestToAddImageToTraining(req);

            expect(result.albumName).toEqual('AlbumName');
            expect(result.artist).toEqual('Artist');
            expect(result.s3Key).toEqual('s3Key');
        });
    });
});