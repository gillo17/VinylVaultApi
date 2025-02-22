import { CopyObjectCommandInput, PutObjectCommandInput, ListObjectsV2CommandInput } from "@aws-sdk/client-s3";

export interface addImageToTrainingData {
    copyObjectParams: CopyObjectCommandInput,
    putObjectParams: PutObjectCommandInput,
    ListObjectsParams: ListObjectsV2CommandInput
}