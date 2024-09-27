import { Api } from './api.js';
// const Api = require('./api.js');
//a program to monitor the server status;
const getTestData = async () => {
	const url = await Api();
	console.log(url);
	let html_data = await url.data;
	let testNoOfScripts;
	let anyUnsecuredLinksLoaded;
	let url_responseStatus = {
		statusCode: url.status,
		statusMessage: url.statusText,
	};
	console.log(url_responseStatus);
	const processHTML = async () => {
		//  console.log(html_data);
		//  console.log(typeof html_data);
		//   html_data="<script></script><script src='http://'></script><script></script>"
		testNoOfScripts = html_data.match(/<script.*><.*script>/gi);
		//   console.log(testNoOfScripts)
		if (testNoOfScripts) {
			console.log(testNoOfScripts.length, 'total scripts loaded');
			anyUnsecuredLinksLoaded = testNoOfScripts.filter(item =>
				item.match(/<script.*[http:]{5,}.*><.*script>/gi)
			);
			if (anyUnsecuredLinksLoaded.length > 0)
				console.log('there are unsecured links');
		} else {
			console.log('No unsecured links found on the page');
		}
		//  console.log(url_responseStatus);
	};
	await processHTML();
	let jsonObj;
	return (jsonObj = {
		url_responseStatus,
		anyUnsecuredLinksLoaded,
	});
	//we have checked the website is reachable now
	//let start with the selenium test now
};

let data = getTestData();
console.log(data);
if (data.url_responseStatus.statusCode === 200) {
	console.log('The website is reachable and we can begin selenium testing');
	data.flag = true;
} else data.flag = false;

const BeginTesting = data.flag;

// export default BeginTesting;
