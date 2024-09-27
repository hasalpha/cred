import axios from 'axios';
import dotenv from 'dotenv/config';
const arg = process.argv[2];
// import Cookies from "js-cookie";
//container for the url's
// const baseURL = process.env+"."+arg;
const baseURL = process.env.dev;
console.log(baseURL);
export const Api = axios.create({
	baseURL: baseURL,
	timeout: 5000,
	headers: {
		'Content-Type': 'application/json',
		accept: 'application/json',
	},
});

// export default Api;
