export class EmailValidator {
    static isValid(email: string): { valid: boolean; disposable?: boolean } {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const domains = ["yopmail.com", "tempmail.com", "throwaway.email", "guerrillamail.com", "mailinator.com", "trashmail.com", "10minutemail.com", "temp-mail.org", "fakeinbox.com", "sharklasers.com"];

        let isDisposable = false;

        for (const domain of domains) {
            if (email.includes(domain)) {
                isDisposable = true;
                break;
            }
        }

        if (!regex.test(email) || email.includes(" ")) {
            return isDisposable ? { valid: false, disposable: true } : { valid: false };
        }

        return isDisposable ? { valid: false, disposable: true } : { valid: true };
    }
}