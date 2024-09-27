const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = './chromedriver_win32/chromedriver.exe';
const firefox = require('selenium-webdriver/firefox');
const fsPromises = require('fs/promises');
require('dotenv/config');
const axios = require('axios');

const generateRandomStartAndEndDate = require('./randomDate.js');
// import Cookies from "js-cookie";
//container for the url's
const baseURL = process.env.local;

const generateRandomName = (desiredStringLength = 6) => {
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

const openFireFoxTest = async () => {
	const service = new firefox.ServiceBuilder('./mozilla/geckodriver.exe');
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

	let adminTestsArr = [];
	let registeredUser = {};
	const AdminRegisterTests = async () => {
		try {
			let getResult = await driver.get(`${baseURL}/admin/register`);
			testArr.push(['Test 0:: Admin Register website reachable', true]);
			//1. Invalid characters for firstName and lastname are passed and accepted : False
			let getPage = await driver.get(`${baseURL}/admin/register`);
			let click = await driver.findElement(By.className('btn btn-primary'));
			let firstName = await driver.findElement(By.id('first-name'));

			await firstName.sendKeys('NIki%%%$$');
			click.click();
			var errorData = await driver.findElement(By.className('notes'));
			if (errorData !== null) {
				testArr.push([
					'Test 1:: Invalid characters for firstName filtered',
					true,
				]);
			}

			await driver.navigate().refresh();

			getPage = await driver.get(`${baseURL}/admin/register`);
			firstName = await driver.findElement(By.id('first-name'));
			let firstNameString = generateRandomName();
			await firstName.sendKeys(`${firstNameString}`);
			registeredUser.firstNameString = firstNameString;
			let secondName = await driver.findElement(By.id('last-name'));
			let lastNameString = generateRandomName();
			await secondName.sendKeys(`${lastNameString}`);
			errorData = await driver.findElement(By.className('notes'));
			if (errorData !== null) {
				testArr.push([
					'Test 1.2:: Invalid characters for last Name filtered',
					true,
				]);
			}

			let countryOptions = await driver.findElement(By.id('select-country'));
			//  await countryOptions.click()
			await countryOptions.sendKeys('Angola');
			let state_value = await driver.findElement(By.id('state-value'));
			await state_value.click();
			await state_value.sendKeys('Baghlan');
			await state_value.click();
			errorData = await driver.findElement(By.className('notes'));
			if (errorData !== null) {
				testArr.push([
					'Test 1.3:: User is able to select country and State',
					true,
				]);
			}

			let email_value = await driver.findElement(By.id('email-value'));
			let emailString = generateEmails();
			registeredUser.emailString = emailString;
			await email_value.sendKeys(`${emailString}`);

			let currentUrl = await driver.getCurrentUrl();
			click = await driver.findElement(By.className('btn btn-primary'));
			await click.click();
			try {
				setTimeout(async () => {
					let btnCreateAccount = await driver.findElement(
						By.id('btnCreateAccount')
					);
					testArr.push([
						'Test 1.4:: User is able to enter email which is unregistered',
						true,
					]);
					testArr.push(['Test 1.5:: Able to move to next page', true]);
					let formValues = [
						'organization-value',
						'employees-value',
						'phone-value',
						'password-value',
						'checkBoxReview',
						'btnCreateAccount',
					];
					formValues.map(async item => {
						let itemSelected = await driver.findElement(By.id(`${item}`));
						if (item === 'organization-value') {
							//validInput check
							itemSelected.sendKeys('abcCorp');
							testArr.push([
								'Test 1.6::User is able to input organization name',
								true,
							]);
						} else if (item === 'employees-value') {
							itemSelected.sendKeys('1-20');
							testArr.push([
								'Test 1.7::User is able to select organization-size',
								true,
							]);
						} else if (item === 'phone-value') {
							let phoneNum = generateRandomPhoneNumbers();
							itemSelected.sendKeys(`${phoneNum}`);
							testArr.push([
								'Test 1.8::User is able to enter phone-value',
								true,
							]);
						} else if (item === 'password-value') {
							let password = '1234567890';
							registeredUser.password = password;
							console.log('registered user details', registeredUser);
							itemSelected.sendKeys('1234567890');
							testArr.push([
								' Test 1.9::User is able to enter phone-value',
								true,
							]);
						} else if (item === 'checkBoxReview') {
							await itemSelected.click();
							testArr.push([
								' Test 2.0::User is able to click the checkbox',
								true,
							]);
						} else if (item === 'btnCreateAccount') {
							itemSelected.click();
							testArr.push([' Test 2.1:: Create button account enabled', true]);
						}
					});
				}, 6000);
			} catch (err) {
				testArr.push([
					'Test 1.4:: User is able to enter email which is unregistered',
					false,
				]);
				testArr.push(['Test 1.5:: Able to move to next page', false]);
			}
			setTimeout(async () => {
				let resend = await driver.findElement(By.id('resend'));
				console.log(Date.now());
				resend.click();
				testArr.push(['Test 2.2:: is the resend button working', true]);
			}, 45000);

			setTimeout(async () => {
				const userLogin = async () => {
					try {
						let getLoginPage = await driver.get(`${baseURL}/signin`);
						console.log('login page accessible', true);
					} catch (err) {
						console.log('login page accesssible', false);
					}
				};
				userLogin();
				//run the test cases here now
				const clientNavigation = async () => {
					try {
						let getResult = await driver.get(`${baseURL}`);
						testArr.push(['Test 2.3: Is Sign In Page Reachable', true]);
						/*
                          Test 2: Check if the user is able to enter input
                        -->If yes-> check if he able to enter invalid inputs 
                        --Check behaviour what happens when the user clicks on the button without password
                        --enter incorrect password-->click on button
                        --enter invalid username/password
                        --enter valid username password**/
						try {
							console.log(registeredUser);
							const blankInputCheck = async () => {
								let pageUrl = await driver.getCurrentUrl();
								let signInButton = await driver.findElement(
									By.className('btn-primary')
								);
								signInButton.click();
								setTimeout(async () => {
									testArr.push([
										'Test 2.4: SignedIn status: Blank Inputs',
										pageUrl !== (await driver.getCurrentUrl()),
									]);
									invalidLogins();
								}, 2000);

								const invalidLogins = async () => {
									// console.log("Checking the signIn Page - with Invalid logins");
									const invalidUserName = async () => {
										let pageUrl = await driver.getCurrentUrl();
										let email_id = await driver.findElement(By.id('email-id'));
										let signInButton = await driver.findElement(
											By.className('btn-primary')
										);
										let user_password = await driver.findElement(
											By.id('user-password')
										);
										await email_id.sendKeys('niki+1112@credibled.com');
										await user_password.sendKeys('123456');
										await signInButton.click();
										testArr.push([
											'Test 2.5: Is user logged in with invalid username',
											pageUrl !== (await driver.getCurrentUrl()),
										]);
									};
									await invalidUserName();

									const invalidUserPassword = async () => {
										await driver.navigate().refresh();
										let pageTitle = await driver.getTitle();
										let pageUrl = await driver.getCurrentUrl();
										let email_id = await driver.findElement(By.id('email-id'));
										let signInButton = await driver.findElement(
											By.className('btn-primary')
										);
										let user_password = await driver.findElement(
											By.id('user-password')
										);
										await email_id.sendKeys('niki+1@credibled.com');
										await user_password.sendKeys('12345688');
										await signInButton.click();
										testArr.push([
											'Test 2.6:Is user logged in with invalid password',
											pageTitle !== (await driver.getTitle()) &&
												pageUrl !== (await driver.getCurrentUrl()),
										]);
										await driver.navigate().refresh();
									};
									await invalidUserPassword();

									const validLogin = async () => {
										//  console.log("Checking the signIn Page - with valid logins");
										let pageTitle = await driver.getTitle();
										let pageUrl = await driver.getCurrentUrl();
										let email_id = await driver.findElement(By.id('email-id'));
										let signInButton = await driver.findElement(
											By.className('btn-primary')
										);
										let user_password = await driver.findElement(
											By.id('user-password')
										);
										await email_id.sendKeys(registeredUser.emailString);
										await user_password.sendKeys(1234567890);
										await signInButton.click();

										setTimeout(async () => {
											//    console.log("Test 5:Is user logged in with valid username and password", pageUrl !== await driver.getCurrentUrl());
											testArr.push([
												'Test 2.7:Is user logged in with valid username and password',
												pageUrl !== (await driver.getCurrentUrl()),
											]);
											HomePageTest();
										}, 2000);
									};
									await validLogin();
								};
							};
							blankInputCheck(); //all inputs check
						} catch (err) {
							console.log('some error');
						}

						const HomePageTest = async () => {
							const clickOperations = async () => {
								const backAndForward = async () => {
									//triggers the user pressing the back and the forward key
									setTimeout(async () => {
										let pageTitle = await driver.getTitle();
										let pageUrl = await driver.getCurrentUrl();
										await driver.navigate().back();
										await driver.navigate().forward();
										testArr.push([
											'Test 2.8: The user stays signed in on pressing back and forward button',
											pageTitle === (await driver.getTitle()) &&
												pageUrl === (await driver.getCurrentUrl()),
										]);
									}, 4000);
								};
								const clickInProgress = async () => {
									//   console.log("click operations--click on new-request-page");
									let pageUrl = await driver.getCurrentUrl();
									try {
										let newRequestButton = await driver.findElement(
											By.className('or_bg')
										);
										await newRequestButton.click();
									} catch (err) {
										await driver.get(
											`${baseURL}/home/requests/add-new-request`
										);
									}
									setTimeout(async () => {
										testArr.push([
											'Test 2.9:: is New Request accessible',
											pageUrl !== (await driver.getCurrentUrl()),
										]);
									}, 5000);
									setTimeout(async () => {
										await driver.navigate().back();
										testArr.push([
											'Test 3.0:: does user comes backs to the previous page after clicking back',
											pageUrl === (await driver.getCurrentUrl()),
										]);
									}, 6500);
								};
								//  logMeOut(); //uncomment to test this
								await backAndForward();
								clickInProgress();
								setTimeout(async () => {
									let pageUrl = await driver.getCurrentUrl();
									await driver.get(`${baseURL}/home/questionnaires`);
									testArr.push([
										'Test 3.1: is user clicked on questionnaire and is accessible--',
										pageUrl !== (await driver.getCurrentUrl()),
									]);
								}, 7500);

								setTimeout(async () => {
									let pageUrl = await driver.getCurrentUrl();
									let adata = await driver.get(`${baseURL}/home/settings`);
									testArr.push([
										'Test 3.2: is user clicked on settings and is accessible--',
										pageUrl !== (await driver.getCurrentUrl()),
									]);
								}, 8500);

								setTimeout(async () => {
									let pageUrl = await driver.getCurrentUrl();
									await driver.get(`${baseURL}/home/requests`);
									testArr.push([
										'Test 3.3: is user clicked on homepage and is accessible--',
										pageUrl !== (await driver.getCurrentUrl()),
									]);
								}, 9500);
							};

							setTimeout(async () => {
								let pageUrl = await driver.getCurrentUrl();
								var links = await driver.findElement(
									By.className('tile-in-progress')
								);
								await links.click();
								testArr.push([
									'Test 3.4: inprogress clicked and is accessible--',
									pageUrl !== (await driver.getCurrentUrl()),
								]);
							}, 11500);

							setTimeout(async () => {
								let pageUrl = await driver.getCurrentUrl();
								var links = await driver.findElement(
									By.className('tile-completed')
								);
								await links.click();
								testArr.push([
									'Test 3.5: completed clicked and is accessible--',
									pageUrl !== (await driver.getCurrentUrl()),
								]);
							}, 12500);

							setTimeout(async () => {
								let pageUrl = await driver.getCurrentUrl();
								var links = await driver.findElement(
									By.className('tile-archived')
								);
								await links.click();
								testArr.push([
									'Test 3.6: archived clicked and is accessible--',
									pageUrl !== (await driver.getCurrentUrl()),
								]);
							}, 13500);

							setTimeout(async () => {
								let pageUrl = await driver.getCurrentUrl();
								var links = await driver.findElement(
									By.className('tile-requested')
								);
								await links.click();
								testArr.push([
									'Test 3.7: requested clicked and is accessible--',
									pageUrl !== (await driver.getCurrentUrl()),
								]);
								console.table(testArr);
							}, 14500);
							//check the filterOperations
							setTimeout(async () => {
								let pageUrl = await driver.getCurrentUrl();
								let newRequestButton = await driver.findElement(
									By.className('or_bg')
								);
								await newRequestButton.click();
								let createNewRequestCounter = 0;
								setTimeout(async () => {
									testArr.push([
										'Test 3.8:: is New Request accessible',
										pageUrl !== (await driver.getCurrentUrl()),
									]);
									const createNewRequest = async () => {
										let questionOptions = await driver.findElement(
											By.className('select-top')
										);
										//  await questionOptions.click()
										await questionOptions.sendKeys('Default questionnaire');
										await questionOptions.click();
										let firstName = await driver.findElement(
											By.id('firstname-input')
										);
										let string = generateRandomName();
										await firstName.sendKeys(string);
										let lastname = await driver.findElement(
											By.id('lastname-input')
										);
										string = generateRandomName();
										await lastname.sendKeys(string);
										let role = await driver.findElement(By.id('role-input'));
										string = generateRandomName();
										await role.sendKeys(string);
										let email = await driver.findElement(By.id('email-input'));
										string = generateEmails();
										await email.sendKeys(string);
										let phone = await driver.findElement(By.id('phone-input'));
										string = generateRandomPhoneNumbers();
										await phone.sendKeys(string);
										setTimeout(async () => {
											try {
												let sendButton = await driver.findElement(
													By.id('btnSendRequest')
												);
												await sendButton.click();
												createNewRequestCounter++;
											} catch (err) {}
										}, 1100);
										if (createNewRequestCounter < 18) {
											setTimeout(async () => {
												try {
													await driver.get(
														`${baseURL}/home/requests/add-new-request`
													);
													setTimeout(async () => {
														await createNewRequest();
													}, 1000);
												} catch (err) {
													await driver.get(
														`${baseURL}/home/requests/add-new-request`
													);
													setTimeout(async () => {
														await createNewRequest();
													}, 1000);
												}
											}, 5000);
										} else {
											let goToRequestPage = await driver.get(
												`${baseURL}/home/requests`
											);
										}
									};
									createNewRequest();
								}, 2000);
							}, 15000);
							clickOperations();
						};
						// validLogin();
					} catch (err) {
						// console.log("website not reachable",err); //uncomment to see the error
						console.log('Test 3.9: website not reachable');
					}
				};
				//uncomment the below
				await clientNavigation();
			}, 75000);
		} catch (err) {
			console.log('unreachable page');
		}
	};

	await AdminRegisterTests();

	//this will be worked on later
	const openGmail = async () => {
		console.log('function to open gmail');
		let getResult = await driver.get(`https://www.gmail.com`);
		let email_value = await driver.findElement(By.id('identifierId'));
		email_value.sendKeys('niki@credibled.com');
		let nextButton = await driver.findElement(By.tagName('button'));
		nextButton.click();
	};
	// openGmail();
};

//uncomment to run the tests
//openFireFoxTest();

//we will generate strings and numbers for the app here
const openFireFoxTest2 = async () => {
	const service = new firefox.ServiceBuilder('./mozilla/geckodriver.exe');
	const driver = new Builder()
		.forBrowser('firefox')
		.setFirefoxOptions(service)
		.build();
	console.log('test cases will be here');

	try {
		let getResult = await driver.get(
			`${baseURL}/candidate-job-history/pcrmei/eaf7d168-843d-4289-8d63-31c8e8f4c690`
		);
		console.log('Test 0.1:: Candidate Job history page reachable', 'true');
		try {
			let pageUrl = await driver.getCurrentUrl();
			let click = await driver.findElement(By.className('btn btn-primary'));
			try {
				click.click();
				try {
					//check if the user is routed to next page after clicking the start button
					setTimeout(async () => {
						console.log(
							'Is user routed to next page',
							(await driver.getCurrentUrl) !== pageUrl
						);
						console.log('the page url is', await driver.getCurrentUrl());
						let currentUrl = await driver.getCurrentUrl();
						if (/\/(job-info)\//.test(currentUrl)) {
							console.log('matches the job info pattern');
							let selectEmploymentType = await driver.findElement(
								By.className('select-top')
							);

							selectEmploymentType.click();
							selectEmploymentType.sendKeys('Full-Time Employee');
							selectEmploymentType.click();

							let organizationName = await driver.findElement(
								By.id('organization-input')
							);
							let firstName = await driver.findElement(
								By.id('firstname-input')
							);
							let lastName = await driver.findElement(By.id('lastname-input'));
							let email = await driver.findElement(By.id('email-input'));
							let phone = await driver.findElement(By.id('phone-input'));
							let role = await driver.findElement(By.id('role-input'));
							let myrole = await driver.findElement(By.id('myrole-input'));

							organizationName.sendKeys(generateRandomName());
							firstName.sendKeys(generateRandomName());
							lastName.sendKeys(generateRandomName());
							email.sendKeys(generateEmails());
							phone.sendKeys(generateRandomPhoneNumbers());
							role.sendKeys(generateRandomName());
							myrole.sendKeys(generateRandomName());

							let startDate = await driver.findElement(By.id('dtStartDate'));
							startDate.sendKeys('March 2009');
							let endDate = await driver.findElement(By.id('dtEndDate'));
							endDate.sendKeys('January 2014');
							let click = await driver.findElement(
								By.className('btn btn-primary')
							);
							click.click();
						} else {
							console.log("doesn't matches the pattern");
							try {
								let pageUrl = await driver.getCurrentUrl();
								console.log(pageUrl);
								let click = await driver.findElement(
									By.className(' btn btn-secondary-outline')
								);
								click.click();
								setTimeout(async () => {
									let urlAfterClick = await driver.getCurrentUrl();
									console.log(urlAfterClick);
									if (/\/(job-info)\//.test(urlAfterClick)) {
										console.log('matches the job info pattern');
										let selectEmploymentType = await driver.findElement(
											By.className('select-top')
										);

										selectEmploymentType.click();
										selectEmploymentType.sendKeys('Full-Time Employee');
										selectEmploymentType.click();

										let organizationName = await driver.findElement(
											By.id('organization-input')
										);
										let firstName = await driver.findElement(
											By.id('firstname-input')
										);
										let lastName = await driver.findElement(
											By.id('lastname-input')
										);
										let email = await driver.findElement(By.id('email-input'));
										let phone = await driver.findElement(By.id('phone-input'));
										let role = await driver.findElement(By.id('role-input'));
										let myrole = await driver.findElement(
											By.id('myrole-input')
										);

										organizationName.sendKeys(generateRandomName());
										firstName.sendKeys(generateRandomName());
										lastName.sendKeys(generateRandomName());
										email.sendKeys(generateEmails());
										phone.sendKeys(generateRandomPhoneNumbers());
										role.sendKeys(generateRandomName());
										myrole.sendKeys(generateRandomName());
										let dateArr = generateRandomStartAndEndDate();
										console.log(dateArr);
										if (dateArr === undefined)
											dateArr = generateRandomStartAndEndDate();
										let startDate = await driver.findElement(
											By.id('dtStartDate')
										);
										startDate.sendKeys(dateArr[0]);
										let endDate = await driver.findElement(By.id('dtEndDate'));
										endDate.sendKeys(dateArr[1]);
										let click = await driver.findElement(
											By.className('btn btn-primary')
										);
										click.click();
									}
								}, 3000);
							} catch (err) {
								console.log('no add button available');
							}
						}
					}, 4000);
				} catch (err) {
					console.log('error getting the url, some referees are already added');
				}
			} catch (err) {
				console.log('user not able to click the start button');
			}
		} catch (err) {
			console.log('not able to locate the button on the page');
		}
	} catch (err) {
		console.log('some error reaching to the website', err);
	}
};
openFireFoxTest2();
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
	let username = 'niki+';
	let domainName = '@credibled.com';
	return `${username}${newStr}${domainName}`;
};
