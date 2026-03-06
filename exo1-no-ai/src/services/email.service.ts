import { EmailValidator } from '../validators/email.validator';

export class EmailService{
    static checkEmail(email:string){
        const normalizedEmail = email.trim().toLowerCase();
        const validResponse = EmailValidator.isValid(normalizedEmail);

        return{email : email,...validResponse,normalized : normalizedEmail}
    }
}