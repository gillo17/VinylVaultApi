import { injectable } from "inversify";
import { saveVinylToWishlistModel } from "../models/wishlist";

@injectable()
export class VinylMapper {

    public async mapRequestToWishlist(AlbumId: string, userId: string): Promise<saveVinylToWishlistModel> {
        return {
            spotifyAlbumID: AlbumId,
            userID: userId
        }
    }

}