const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

const generateYears = index => {
	let startYear = 1951;
	let endYear = 2023;
	let arr = [];
	for (let i = startYear; i < endYear; i++) {
		arr.push(i);
	}
	return arr[index];
};

generateRandomTime = () => {
	let monthIndex = Math.floor(Math.random() * 100) % 12;
	let yearIndex = Math.floor(Math.floor(Math.random() * 1000) % 72);
	let year = generateYears(yearIndex);
	let month = months[monthIndex];
	return month + ' ' + year;
};

function generateRandomStartAndEndDate() {
	//this generates a start date and end date > start Date;
	//   let startDate=new Date("March 1989") //this values needs to be replaced by logic
	// let endDate= new Date("June 1978")//this values needs to be replaced by logic

	let startDate = generateRandomTime();
	startDateFormat = new Date(startDate);

	let endDate = generateRandomTime();
	endDateFormat = new Date(endDate);

	if (
		startDateFormat < endDateFormat &&
		endDateFormat > startDateFormat &&
		endDateFormat < new Date()
	) {
		//  console.log("logic works");
		return [startDate, endDate];
	} else {
		//  console.log("logic doesn't work");

		for (let i = 0; i < 5; i++) {
			let startDate = generateRandomTime();
			startDateFormat = new Date(startDate);

			let endDate = generateRandomTime();
			endDateFormat = new Date(endDate);
			if (
				startDateFormat < endDateFormat &&
				endDateFormat > startDateFormat &&
				endDateFormat < new Date()
			) {
				//  console.log("logic works");
				return [startDate, endDate];
				break;
			}
		}
	}
}

module.exports = generateRandomStartAndEndDate;
