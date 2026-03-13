import { EmailService } from '../src/services/email.service';

describe('EmailService.checkEmail', () => {
	it('Email valide classique', () => {
		const result = EmailService.checkEmail('john.doe@example.com');

		expect(result).toEqual({
			email: 'john.doe@example.com',
			valid: true,
			normalized: 'john.doe@example.com',
		});
	});

	it('Email jetable (yopmail) → valid: false, disposable: true', () => {
		const result = EmailService.checkEmail('jean.dupont@yopmail.com');

		expect(result).toEqual({
			email: 'jean.dupont@yopmail.com',
			valid: false,
			disposable: true,
			normalized: 'jean.dupont@yopmail.com',
		});
	});

    it('espaces et majuscules', () => {
		const result = EmailService.checkEmail('  john.DOE@example.com  ');

		expect(result).toEqual({
			email: '  john.DOE@example.com  ',
			valid: true,
			normalized: 'john.doe@example.com',
		});
	});

	it('Email format invalide (pas de @) → valid: false', () => {
		const result = EmailService.checkEmail('hihihiha');

		expect(result).toEqual({
			email: 'hihihiha',
			valid: false,
			normalized: 'hihihiha',
		});
	});
});
