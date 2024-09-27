const letters =
	'abcdefghijklmnopqrstuvwsxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-()&@';

const randomOrganization = () => {
	let letter = letters.split('');

	let Organizationlength = Math.floor(Math.random() * 786) % 30;
	let string = '';
	if (Organizationlength < 5) Organizationlength = 8;
	for (let i = 0; i < Organizationlength; i++) {
		const index = Math.floor(Math.random() * 100) % 68;
		string = string + letter[index];
	}
	console.log(string);
};
for (let i = 0; i < 100; i++) {
	randomOrganization();
}
