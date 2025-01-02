import validator from 'validator';

export class UserValidator {

    public validateCreateAccount = async (req: any) => {

        const userData = req.body;

        var errors: string[] = [];

        if (!userData.email) {
            errors.push('Email is required');
        }

        else if (!validator.isEmail(userData.email)) {
            errors.push("Please enter a valid email address")
        }

        if (userData.email.length > 50) {
            errors.push('Email is too long, max 50 characters');
        }

        if (!userData.firstname) {
            errors.push('First name is required');
        }

        else if (userData.firstname.length > 50) {
            errors.push('firstname is too long, max 50 characters');
        }

        else if (!validator.isAlpha(userData.firstname)) {
            errors.push('First name must be alphabetic');
        }

        if (!userData.lastname) {
            errors.push('Last name is required');
        }

        else if (userData.lastname.length > 50) {
            errors.push('Last name is too long, max 50 characters');
        }

        else if (!validator.isAlpha(userData.lastname)) {
            errors.push('Last name must be alphabetic');
        }

        if (!userData.password) {
            errors.push('Password is required');
        }

        return errors;

    }

}