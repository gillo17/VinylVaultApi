import { GetObjectCommand } from "@aws-sdk/client-s3";
import { addImageToTrainingData } from "../models/aws";
import { DetectCustomLabelsCommandInput } from "@aws-sdk/client-rekognition";

export class AwsMapper {
    
    public async mapRequestToAWSImageInterface(req: any): Promise<DetectCustomLabelsCommandInput > {

        const awsImageInterface: DetectCustomLabelsCommandInput = {
            Image: {
                S3Object:{
                    Bucket: process.env.AWS_S3_BUCKET_NAME || '',
                    Name: req.body.key

                }
            },
            MinConfidence: 70.0,
            ProjectVersionArn: process.env.REKOGNITION_ARN || ''
        }
        return awsImageInterface;

    }

    public async generatePresignedUrlRequest(): Promise<{ command: GetObjectCommand, fileKey: string }>  {

        const fileKey: string = new Date().toISOString();

        const presignedUrlCommand = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME || '',
            Key: fileKey,
        });

        return { command: presignedUrlCommand, fileKey: fileKey };
    }

    public async mapRequestToAddImageToTraining(req: any): Promise<addImageToTrainingData> {

        const folderName = await this.folderNameFormatter(req.body.Artist, req.body.AlbumName)
    
        const addImageToTrainingData = {
            copyObjectParams: {
                Bucket: "vinyls-for-training",
                CopySource: `/new-vinyls/${req.body.s3Key}`,
                Key: `vinyls-submitted-for-training/${folderName}/${req.body.s3Key}`,
            },
            putObjectParams: {
                Bucket: 'vinyls-for-training',
                Key: `vinyls-submitted-for-training/${folderName}/`,
            },
            ListObjectsParams: {
                Bucket: 'vinyls-for-training',
                Prefix: `vinyls-submitted-for-training/${folderName}/`,
            }

        }
        return addImageToTrainingData;
    }

    private async folderNameFormatter(artist: string, albumName: string) {
        const formattedArtist = artist.charAt(0).toUpperCase() + artist.slice(1).toLowerCase();
        const formattedAlbumName = albumName.charAt(0).toUpperCase() + albumName.slice(1).toLowerCase();

        return `${formattedArtist}_${formattedAlbumName}`;
    }
}