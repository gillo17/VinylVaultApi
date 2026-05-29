import Collection from '../../../src/models/collections';

export function generateMockCollectionData() {
    const testCollection = new Collection({
        _id: 'testId',
        collectionName: 'testCollectionName',
        description: 'testDescription',
        vinyls: [],
        userID: 'testUserID',
    });

    return testCollection;
}
