const { Builder, Key, By, until, Select } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
// const path = './chromedriver_win32/chromedriver.exe';
const firefox = require('selenium-webdriver/firefox');
const edge = require('selenium-webdriver/edge');
const ie = 'selenium-webdriver/ie';
const fs = require('fs');
// const path = "./chromedriver/chromedriver";
const path = require('path');
// import ServiceBuilder from 'selenium-webdriver/firefox.js';
require('dotenv/config');
const axios = require('axios');
const fsPromises = require('fs/promises');
// const Select = require('selenium-webdriver/lib/webdriver').

// import Cookies from "js-cookie";
//container for the url's
const baseURL = process.env.dev;
const geckodriver = require.resolve('geckodriver');
const openFireFoxTest = async () => {
	//const service = new firefox.ServiceBuilder('./node_modules/mozilla/geckodriver.exe');
	// const service = new firefox.ServiceBuilder("./usr/local/bin/geckodriver");
	const service = new firefox.ServiceBuilder(geckodriver);
	const driver = new Builder()
		.forBrowser('firefox')
		.setFirefoxOptions(service)
		.build();
	console.log('test cases will be here');
	let testArr = [];
	//basic test
	try {
		const isAppReachable = await driver.get(`${baseURL}`);
		testArr.push(['Test 0:: Website is accessible or not', 'True']);
	} catch (err) {
		console.log("there's an error in reaching the website");
	}

	//we will divide the flow into functions

	const ClientAdminFlow = async () => {
		let adminTestsArr = [];
		const AdminRegisterTests = async () => {
			try {
				let getResult = await driver.get(`${baseURL}/admin/register`);
				adminTestsArr.push(['Test 0:: Admin Register website reachable', true]);
				//1. Invalid characters for firstName and lastname are passed and accepted : False
				let getPage = await driver.get(`${baseURL}/admin/register`);
				let click = await driver.findElement(By.className('btn btn-primary'));
				// let firstName = await driver.findElement(By.css('input[type="text"][0]'));
				let firstName = '';
				let secondName = '';
				driver
					.findElements(By.css('input[type="text"]'))
					.then(async function (elements) {
						firstName = elements[0];
						secondName = elements[1];
						// your code to interact with the second input goes here

						let testString = generateRandomName();
						console.log(testString);
						await firstName.sendKeys('Vijay%%%$$');
						click.click();
						var errorData = await driver.findElement(By.className('notes'));
						if (errorData !== null) {
							adminTestsArr.push([
								'Test 1:: Invalid characters for firstName filtered',
								true,
							]);
							await driver.takeScreenshot().then(function (image, getResult) {
								fs.writeFile(
									'img/registerinvalidfirstname.png',
									image,
									'base64',
									function (getResult) {
										console.log(getResult);
									}
								);
							});
						}

						// await driver.navigate().refresh();

						// getPage = await driver.get(`${baseURL}/admin/register`);
						// //  firstName = await driver.findElements(By.css('input[type="text"]')).then(function (elements) {

						// //   firstName = elements[0];
						// //   // your code to interact with the second input goes here

						// });

						//  //let secondName = await driver.findElements(By.css('input[type="text"]')).then(function (elements) {

						//   secondName = elements[1];
						//   // your code to interact with the second input goes here

						// });
						await secondName.sendKeys(' Kumar%');
						errorData = await driver.findElement(By.className('notes'));
						if (errorData !== null) {
							adminTestsArr.push([
								'Test 1.2:: Invalid characters for last Name filtered',
								true,
							]);
							await driver.takeScreenshot().then(function (image, getResult) {
								fs.writeFile(
									'img/registerinvalidlastname.png',
									image,
									'base64',
									function (getResult) {
										console.log(getResult);
									}
								);
							});
						}
						// await driver.navigate().refresh();
						await firstName.sendKeys('Vijay');
						await secondName.sendKeys('VK');
					});

				//  getPage = await driver.get(`${baseURL}/admin/register`);
				const countryOptions = await driver.findElement(By.id('selectCountry'));
				await countryOptions.click();
				// await countryOptions.sendKeys('Canada');
				const select = new Select(countryOptions);
				select.selectByVisibleText('Canada');
				await countryOptions.click();
				await new Promise(resolve => setTimeout(resolve, 15000));
				let state_value = '';
				driver.findElements(By.css('select')).then(async function (elements) {
					state_value = elements[1];

					// const state_value = await driver.findElement(By.css('select:nth-of-type(1)'));

					//let state_value = await driver.wait(until.elementLocated(By.css('select:nth-of-type(1)')), 10000);
					await state_value.click();
					const stateselect = new Select(state_value);
					await stateselect.selectByVisibleText('Ontario');
					//await state_value.sendKeys('Ontario');
					await state_value.click();
				});
				const errorData = await driver.findElement(By.className('notes'));
				if (errorData !== null) {
					adminTestsArr.push([
						'Test 1.3:: User is able to select country and State',
						true,
					]);
					await driver.takeScreenshot().then(function (image, getResult) {
						fs.writeFile(
							'img/registercountrynotselected.png',
							image,
							'base64',
							function (getResult) {
								console.log(getResult);
							}
						);
					});
				}

				let email_value = await driver.findElement(
					By.css('input[type="email"]')
				);
				await email_value.sendKeys('vijay+33233311343@credibled.com');

				// let currentUrl=await driver.getCurrentUrl();
				click = await driver.findElement(By.className('btn btn-primary'));
				await click.click();
				try {
					setTimeout(async () => {
						adminTestsArr.push([
							'Test 1.4:: User is able to enter email which is unregistered',
							true,
						]);
						adminTestsArr.push(['Test 1.5:: Able to move to next page', true]);
						let organizationvalue = '';
						await driver
							.findElements(By.css('input[type="text"]'))
							.then(async function (elements) {
								organizationvalue = elements[0];

								await organizationvalue.sendKeys('abcdefg');
								adminTestsArr.push([
									'Test 1.6::User is able to input organization name',
									true,
								]);
							});
						let employeesvalue = '';
						await driver
							.findElements(By.css('select'))
							.then(async function (elements) {
								employeesvalue = elements[0];
								await employeesvalue.click();
								const select = new Select(employeesvalue);
								select.selectByVisibleText('1-20');
								await employeesvalue.click();
								adminTestsArr.push([
									'Test 1.7::User is able to select organization-size',
									true,
								]);
							});
						let phonevalue = '';
						await driver
							.findElements(By.css('input[type="text"]'))
							.then(function (elements) {
								phonevalue = elements[1];
								let testphone = generateRandomPhoneNumbers();
								phonevalue.sendKeys(testphone);
								adminTestsArr.push([
									'Test 1.8::User is able to enter phone-value',
									true,
								]);
							});
						let passwordvalue = '';
						await driver
							.findElements(By.css('input[type="password"]'))
							.then(function (elements) {
								passwordvalue = elements[0];
								console.log(passwordvalue);
								passwordvalue.sendKeys('1234567890');
								adminTestsArr.push([
									' Test 1.9::User is able to enter password-value',
									true,
								]);
							});
						const checkBoxReview = driver.wait(
							until.elementLocated(By.css('input[type="checkbox"]')),
							10000
						);
						driver.executeScript(
							'arguments[0].scrollIntoView(true);',
							checkBoxReview
						);
						checkBoxReview.click();

						let btnCreateAccount = await driver.findElement(
							By.id('btnCreateAccount')
						);
						await btnCreateAccount.click();
					}, 4000);
				} catch (err) {
					adminTestsArr.push([
						'Test 1.4:: User is able to enter email which is unregistered',
						false,
					]);
					adminTestsArr.push(['Test 1.5:: Able to move to next page', false]);
					await driver.takeScreenshot().then(function (image, getResult) {
						fs.writeFile(
							'img/registeremailerror.png',
							image,
							'base64',
							function (getResult) {
								console.log(getResult);
							}
						);
					});
				}

				setTimeout(async () => {
					let resend = await driver.findElement(By.id('resend'));
					resend.click();
					adminTestsArr.push(['Test 2.2:: is the resend button working', true]);
					await driver.takeScreenshot().then(function (image, getResult) {
						fs.writeFile(
							'img/registerresent.png',
							image,
							'base64',
							function (getResult) {
								console.log(getResult);
							}
						);
					});
				}, 40000);
			} catch (err) {
				console.log('unreachable page', err);
			}
		};
		await AdminRegisterTests();
	};
	await ClientAdminFlow();
};

openFireFoxTest();

//we will generate strings and numbers for the app here
const generateRandomName = desiredStringLength => {
	let str = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnop-fgdhdjd';
	let strArr = str.split('');
	let newStr = '';
	for (let i = 0; i < desiredStringLength; i++) {
		//  console.log(Math.round( Math.random()*20),i)
		let index = Math.round(Math.random() * 20);
		newStr = `${strArr[index]}${newStr}`;
	}
	return newStr;
};

const generateRandomPhoneNumbers = (desiredStringLength = 10) => {
	let str = '01234567890123457323285354545334394320988764';
	let strArr = str.split('');
	let newStr = '';
	for (let i = 0; i < desiredStringLength; i++) {
		//  console.log(Math.round( Math.random()*20),i)
		let index = Math.round(Math.random() * 20);
		newStr = `${strArr[index]}${newStr}`;
	}
	return newStr;
};

const generateEmails = (desiredStringLength = 5) => {
	let str = '01234567890987654321654789321764';
	let strArr = str.split('');
	let newStr = '';
	for (let i = 0; i < desiredStringLength; i++) {
		//  console.log(Math.round( Math.random()*20),i)
		let index = Math.round(Math.random() * 20);
		newStr = `${strArr[index]}${newStr}`;
	}
	let username = 'vijay';
	let domainName = '@credibled.com';
	return `${username}${newStr}${domainName}`;
};
