import AWS, { Rekognition } from 'aws-sdk';
import Logging from '../utils/Logging';

const rekognition = new AWS.Rekognition({
  region: 'eu-west-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export class AwsService {

    public async identifyVinyl(params: Rekognition.Types.DetectCustomLabelsRequest) {

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