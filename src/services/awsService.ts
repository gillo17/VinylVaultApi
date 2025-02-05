import AWS, { Rekognition } from 'aws-sdk';
import Logging from '../utils/Logging';
import { addImageToTrainingData } from '../models/aws';

const rekognition = new AWS.Rekognition({
  region: 'eu-west-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const s3 = new AWS.S3({
  region: 'eu-west-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

export class AwsService {

    public async identifyVinyl(params: Rekognition.Types.DetectCustomLabelsRequest) {
        try {
            const res = await rekognition.detectCustomLabels(params).promise();

            if (res.CustomLabels && res.CustomLabels.length > 0) {
                if (res.CustomLabels[0].Name) {
                    return this.vinylNameSplitter(res.CustomLabels[0].Name)
                } else {
                    Logging.error('Label Name is undefined');
                }
            } else {
                return null;
            }
        } catch (error) {
            Logging.error(error);
            return null;
        }

    }

    public async addImageToTrainingData(trainingData: addImageToTrainingData) {

        const folderName = await this.folderNameFormatter(trainingData.artist, trainingData.albumName)

        if (!process.env.AWS_S3_BUCKET_NAME) {
            throw new Error('AWS_S3_BUCKET_NAME is not defined');
        }

        const params = {
            Bucket: 'vinyls-for-training',
            Prefix: `vinyls-submitted-for-training/${folderName}/`,
        };

        const s3FolderExists: AWS.S3.ListObjectsV2Output = await s3.listObjectsV2(params).promise();

        if (s3FolderExists.Contents && s3FolderExists.Contents.length > 0) {

            const params = {
                Bucket: "vinyls-for-training",
                CopySource: `/new-vinyls/${trainingData.s3Key}`,
                Key: `vinyls-submitted-for-training/${folderName}/${trainingData.s3Key}`,
            };

            await s3.copyObject(params).promise();
        } else {

            await s3.putObject({
                Bucket: 'vinyls-for-training',
                Key: `vinyls-submitted-for-training/${folderName}/`,
                Body: '',
            }).promise();

            const params = {
                Bucket: 'vinyls-for-training',
                CopySource: `/new-vinyls/${trainingData.s3Key}`,
                Key: `vinyls-submitted-for-training/${folderName}/${trainingData.s3Key}`,
            };

            await s3.copyObject(params).promise();
        }

        return trainingData;
        
    }

    public async generatePresignedUrl(params: any): Promise<string|null> {
        
        try {
            const url = await s3.getSignedUrlPromise('putObject', params);

            Logging.info(url)

            return url;
        } catch (error) {
            Logging.info(error)

            return null;
        }

    }

    private vinylNameSplitter(label: string) {
        const [artist, albumName] = label.split('_');

        const splitArtist = artist.split(/(?=[A-Z])/);
        const splitAlbumName = albumName.split(/(?=[A-Z])/);

        const formattedArtist = splitArtist.join(' ');
        const formattedAlbumName = splitAlbumName.join(' ');

        return [formattedArtist, formattedAlbumName]
    }

    private async folderNameFormatter(artist: string, albumName: string) {
        const formattedArtist = artist.charAt(0).toUpperCase() + artist.slice(1).toLowerCase();
        const formattedAlbumName = albumName.charAt(0).toUpperCase() + albumName.slice(1).toLowerCase();

        return `${formattedArtist}_${formattedAlbumName}`;
    
    }
}