import Rekognition, { DetectLabelsRequest } from "aws-sdk/clients/rekognition";
import { addImageToTrainingData } from "../models/aws";

export class AwsMapper {
    
    public async mapRequestToAWSImageInterface(req: any): Promise<Rekognition.Types.DetectCustomLabelsRequest > {

        const awsImageInterface: Rekognition.Types.DetectCustomLabelsRequest = {
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

    public async generatePresignedUrlRequest(): Promise<any>  {

        const presignedUrlInterface = {
            Bucket: process.env.AWS_S3_BUCKET_NAME || '',
            Key: new Date().toISOString(),
            Expires: 30,
            ContentType: 'image/jpeg'
        }
        return presignedUrlInterface;
        
    }

    public async mapRequestToAddImageToTraining(req: any): Promise<addImageToTrainingData> {
    
        const addImageToTrainingData: addImageToTrainingData = {
            s3Key: req.body.s3Key,
            artist: req.body.Artist,
            albumName: req.body.AlbumName
        }
        return addImageToTrainingData;
    }
}