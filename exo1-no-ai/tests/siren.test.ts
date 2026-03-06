export class EmailValidator{

    static isValid(email:string) : 
    {
        valid: boolean;
        disposable?: boolean;
    } {
       const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       const domains = ["yopmail.com", "tempmail.com", "throwaway.email", "guerrillamail.com", "mailinator.com", "trashmail.com", "10minutemail.com", "temp-mail.org", "fakeinbox.com", "sharklasers.com"];

       if(!regex.test(email) || email.includes(" ")){
            return { valid: false, disposable: false };
       }

       const emailDomain = email.split('@')[1].toLowerCase();
       if (domains.includes(emailDomain)) return { valid: false, disposable: true };

       return { valid: true, disposable: false };
    }
}