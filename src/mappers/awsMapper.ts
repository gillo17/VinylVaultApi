import Rekognition, { DetectLabelsRequest } from "aws-sdk/clients/rekognition";

export class AwsMapper {
    
    public async mapRequestToAWSImageInterface(req: any): Promise<Rekognition.Types.DetectCustomLabelsRequest > {
        

        const awsImageInterface: Rekognition.Types.DetectCustomLabelsRequest = {
            Image: {
                Bytes: req.file.buffer
            },
            MinConfidence: 70.0,
            ProjectVersionArn: process.env.REKOGNITION_ARN || ''
        }
        return awsImageInterface;

    }
}