export class SirenValidator{

    static isValid(siren:string) : boolean
    {
       return this.luhnAlgorithm(siren);
    }

    static luhnAlgorithm(numero : string) : boolean
    {
        let digits = numero.split('').map(Number);

        for (let i = digits.length - 2; i >= 0; i-=2) 
        {
            digits[i] = digits[i] *2;
            if (digits[i]>9)
            {
                digits[i] = digits[i] - 9
            }
        }
        const somme = this.sumNumber(digits);
        return somme % 10 ==0;
    }

    static sumNumber(tab: number[]): number 
    {
        let acc: number = 0;
        tab.forEach(element => {
            acc += element;
        });
        return acc;
    }
    
}