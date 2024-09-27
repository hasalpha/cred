//generates random phone numbers

let numbers = '1234567890';

const generatePhone = () => {
	let number = numbers.split('');
	let arr = [];
	for (let i = 0; i < 10; i++) {
		const index = Math.floor(Math.random() * 657) % 10;
		arr.push(number[index]);
	}
	console.log(arr.join(''));
};

for (let i = 0; i < 100; i++) {
	generatePhone();
}
