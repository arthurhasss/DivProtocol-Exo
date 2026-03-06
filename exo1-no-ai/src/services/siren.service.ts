import { SirenValidator } from '../validators/siren.validator';

export class SirenService{
    static checkSiren(siren:string): { status: number, body: any }
    {
        const withoutSpaceSiren = siren.replace(/\s+/g, '');

        if (withoutSpaceSiren.length!=9 || !/^\d+$/.test(withoutSpaceSiren)) {
            return {status: 422, body: {error: 'invalid format'}};
        }
        const validResponse = SirenValidator.isValid(withoutSpaceSiren);
        const formattedSiren = withoutSpaceSiren.replace(/(\d{3})(?=\d)/g, '$1 ').trim();

      

        return{status: 200, body: {siren : siren,valid : validResponse, formatted : formattedSiren}}
    }
}