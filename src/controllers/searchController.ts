import { Request, Response } from 'express';

export class searchController {

    public searchVinylsByNameAndArtist = async (req: Request, res: Response): Promise<Response> => {
        
                
        return res.status(200).json({ message: 'Search Vinyls by Name and Artist' });
    }
}