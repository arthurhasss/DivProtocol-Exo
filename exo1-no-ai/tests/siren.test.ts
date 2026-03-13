import { SirenService } from '../src/services/siren.service';

describe('SirenService.checkSiren', () => {
	it('SIREN valide (Luhn OK) → valid: true', () => {
		const result = SirenService.checkSiren('732829320');

		expect(result).toEqual({
			status: 200,
			body: {
				siren: '732829320',
				valid: true,
				formatted: '732 829 320',
			},
		});
	});

	it('SIREN invalide (mauvais checksum)', () => {
		const result = SirenService.checkSiren('732829321');

		expect(result).toEqual({
			status: 200,
			body: {
				siren: '732829321',
				valid: false,
				formatted: '732 829 321',
			},
		});
	});

	it('SIREN trop court', () => {
		const result = SirenService.checkSiren('73254');

		expect(result).toEqual({
			status: 422,
			body: { error: 'invalid format' },
		});
	});

    it('SIREN trop long', () => {
		const result = SirenService.checkSiren('67676767676767');

		expect(result).toEqual({
			status: 422,
			body: { error: 'invalid format' },
		});
	});

    
    it('Body manquant → 400', () => {
		const result = SirenService.checkSiren('');

		expect(result).toEqual({
			status: 400,
			body: { error: 'invalid format' },
		});
	});

    	it('SIREN mal écrit', () => {
		const result = SirenService.checkSiren('  73 2 82 9 320   ');

		expect(result).toEqual({
			status: 200,
			body: {
				siren: '  73 2 82 9 320   ',
				valid: true,
				formatted: '732 829 320',
			},
		});
	});

    it('SIREN pas que des chiffres', () => {
		const result = SirenService.checkSiren('  7A B 82 9 3L0   ');

		
		expect(result).toEqual({
			status: 422,
			body: { error: 'invalid format' },
		});
	});
});
