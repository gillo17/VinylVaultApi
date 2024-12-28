import crypto, { pbkdf2Sync } from 'crypto';
import { injectable } from 'inversify';

@injectable()
export class SaltAndHash {
    public hashPassword(password: string) {
        var salt = crypto.randomBytes(128).toString('base64');
        var iterations = 10000;
        var hash = pbkdf2Sync(
            password,
            salt,
            iterations,
            64,
            'sha512'
        ).toString('base64');

        return [salt, hash, iterations];
    }

    public vaildatePassword(
        savedHash: string,
        savedSalt: string,
        savedIterations: number,
        password: string
    ): boolean {
        var hash = pbkdf2Sync(
            password,
            savedSalt,
            savedIterations,
            64,
            'sha512'
        ).toString('base64');
        return savedHash === hash;
    }
}
