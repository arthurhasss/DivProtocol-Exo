import { EmailValidator } from '../validators/email.validator';

export class EmailService {
    static checkEmail(email: string): { status: number; body: any } {
        const trimmedEmail = email.trim();
        if (!email || trimmedEmail.length === 0) {
            return { status: 400, body: { error: 'invalid format' } };
        }

        if (trimmedEmail.includes(' ')) {
            return { status: 422, body: { error: 'invalid format' } };
        }

        const normalizedEmail = trimmedEmail.toLowerCase();
        const validResponse = EmailValidator.isValid(normalizedEmail);

        const body = { email, ...validResponse, normalized: normalizedEmail };
        const status = validResponse.valid ? 200 : 422;

        return { status, body };
    }
}