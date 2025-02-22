import validator from 'validator';

export class CollectionsValidator {
    public async validateCreateCollection(req: any) {

        const collectionData = req.body;

        var errors: string[] = [];

        if (!collectionData.collectionName) {
            errors.push('Collection name is required');
        } else if (!validator.isAlphanumeric(collectionData.collectionName, 'en-US', { ignore: ' ' })) {
            errors.push('Collection name must only contain letters and numbers');
        } else if (collectionData.collectionName.length > 30) {
            errors.push('Collection name is too long, max 30 characters');
        }
        
        if (collectionData.description) {
            if (collectionData.description.length > 50) {
                errors.push('Description is too long, max 50 characters');
            } else if (!validator.isAlpha(collectionData.description, 'en-US', { ignore: ' ' })) {
                errors.push('Description must be alphabetic');
            }
        }
        
        return errors;
    }

    public async validateSaveToCollection(req: any) {

        var errors: string[] = [];

        if (!req.body.collectionID) {
            errors.push('Collection ID is required');
        }

        if(!req.body.VinylID) {
            errors.push('Vinyl ID is required');
        }

        if (errors.length > 0) {
            throw new Error(String(errors));
        }

    }
}   