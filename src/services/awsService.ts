import { DetectCustomLabelsCommandInput, DetectCustomLabelsCommand } from '@aws-sdk/client-rekognition';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, ListObjectsV2Command, CopyObjectCommand, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { addImageToTrainingData } from '../models/aws';
import { RekognitionClient } from "@aws-sdk/client-rekognition";

const rekognition = new RekognitionClient({
  region: 'eu-west-1',
  credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

const s3 = new S3Client({
    region: 'eu-west-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
})

export class AwsService {

    public async identifyVinyl(params: DetectCustomLabelsCommandInput): Promise<string[]> {
        try {

            const command = new DetectCustomLabelsCommand(params);
            const res = await rekognition.send(command);

            if (res.CustomLabels && res.CustomLabels.length > 0) {
                if (res.CustomLabels[0].Name) {
                    return this.vinylNameSplitter(res.CustomLabels[0].Name)
                } else {
                    throw new Error(String('Label Name is undefined'));
                }
            } else {
                throw new Error(String('No labels found'));
            }
        } catch (error) {
            throw new Error(String(error));
        }
    }

    public async addImageToTrainingData(trainingData: addImageToTrainingData) {

        if (!process.env.AWS_S3_BUCKET_NAME) {
            throw new Error('AWS_S3_BUCKET_NAME is not defined');
        }

        try {

            const command = new ListObjectsV2Command(trainingData.ListObjectsParams);
            const s3FolderExists = await s3.send(command);
        
            if (s3FolderExists.Contents && s3FolderExists.Contents.length > 0) {

                const command = new CopyObjectCommand(trainingData.copyObjectParams);
                await s3.send(command);

            } else {

                const putCommand = new PutObjectCommand(trainingData.putObjectParams);
                await s3.send(putCommand);

                const copyCommand = new CopyObjectCommand(trainingData.copyObjectParams);
                await s3.send(copyCommand);
            }     

        } catch (error) {
            throw new Error(String(error));
        }
   
    }

    public async generatePresignedUrl(params: GetObjectCommand): Promise<string> {
        try {
            const signedUrl = await getSignedUrl(s3, params, { expiresIn: 30 });

            return signedUrl;
        } catch (error) {
            throw new Error(String(error));
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
}