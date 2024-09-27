const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = './chromedriver_win32/chromedriver.exe';
const firefox = require('selenium-webdriver/firefox');
const fs = require('fs');
const fsPromises = require('fs/promises');
const nodemailer = require('nodemailer');
require('dotenv/config');
const axios = require('axios');
const arg = process.argv[2];

// import Cookies from "js-cookie";
//container for the url's
// const baseURL=process.env+"."+arg;
const baseURL = process.env.dev;
const geckodriver = require.resolve('geckodriver');
const openFireFoxTest = async () => {
	let testArr = [];
	// const service = new firefox.ServiceBuilder('./node_modules/mozilla/geckodriver.exe');
	// const service = new firefox.ServiceBuilder("./usr/local/bin/geckodriver");
	// const service = new firefox.ServiceBuilder("geckodriver");
	const service = new firefox.ServiceBuilder(geckodriver);
	const driver = new Builder()
		.forBrowser('firefox')
		.setFirefoxOptions(service)
		.build();

	//to store the data of test results
	let data_test;
	//Test#1: Website reachable or not// all tests here
	const clientNavigation = async () => {
		try {
			let getResult = await driver.get(`${baseURL}/signin`);
			//  console.log("Test 1: website reachable");
			testArr.push(['Test 0: website reachable', true]);
			await driver.takeScreenshot().then(function (image, getResult) {
				fs.writeFile(
					'img/sitereachable.png',
					image,
					'base64',
					function (getResult) {
						console.log(getResult);
					}
				);
			});
			//  console.table(testArr)
			/*
      Test 2: Check if the user is able to enter input
    -->If yes-> check if he able to enter invalid inputs 
    --Check behaviour what happens when the user clicks on the button without password
    --enter incorrect password-->click on button
    --enter invalid username/password
    --enter valid username password**/
			const blankInputCheck = async () => {
				let pageUrl = await driver.getCurrentUrl();
				let signInButton = await driver.findElement(
					By.className('btn-primary')
				);
				signInButton.click();
				setTimeout(async () => {
					// console.log("Test 2: SignedIn status: Blank Inputs", pageUrl !== await driver.getCurrentUrl());
					testArr.push([
						'Test 1: SignedIn status: Blank Inputs',
						pageUrl !== (await driver.getCurrentUrl()),
					]);
					invalidLogins();
				}, 2000);

				const invalidLogins = async () => {
					// console.log("Checking the signIn Page - with Invalid logins");
					const invalidUserName = async () => {
						let pageTitle = await driver.getTitle();
						//  console.log("pageTitle",pageTitle);
						let pageUrl = await driver.getCurrentUrl();
						//  console.log("page url",pageUrl);
						// let email_id = await driver.findElement(By.id('email-id'));
						let email_id = await driver.findElement(
							By.css('input[type="email"]')
						);
						let signInButton = await driver.findElement(
							By.className('btn-primary')
						);
						// let user_password = await driver.findElement(By.id('user-password'));
						let user_password = await driver.findElement(
							By.css('input[type="password"]')
						);
						//   console.log("checking with Invalid username and password");
						await email_id.sendKeys('vijay@credibled.com');
						await user_password.sendKeys('123456');
						await signInButton.click();
						// console.log("test 3: Is user logged in with invalid username", pageTitle !== await driver.getTitle() && pageUrl !== await driver.getCurrentUrl());
						testArr.push([
							'Test 2: Is user logged in with invalid username',
							pageUrl !== (await driver.getCurrentUrl()),
						]);
						await driver.takeScreenshot().then(function (image, getResult) {
							fs.writeFile(
								'img/invalidlogin.png',
								image,
								'base64',
								function (getResult) {
									console.log(getResult);
								}
							);
						});
					};
					await invalidUserName();

					const invalidUserPassword = async () => {
						await driver.navigate().refresh();
						let pageTitle = await driver.getTitle();
						//   console.log("pageTitle",pageTitle);
						let pageUrl = await driver.getCurrentUrl();
						//   console.log("page url",pageUrl);
						let email_id = await driver.findElement(
							By.css('input[type="email"]')
						);
						let signInButton = await driver.findElement(
							By.className('btn-primary')
						);
						let user_password = await driver.findElement(
							By.css('input[type="password"]')
						);
						// console.log("checking with valid username and password");
						await email_id.sendKeys('vijay@credibled.com');
						await user_password.sendKeys('test@2025');
						await signInButton.click();
						// console.log("Test 4:Is user logged in with invalid password", pageTitle !== await driver.getTitle() && pageUrl !== await driver.getCurrentUrl());
						testArr.push([
							'Test 3:Is user logged in with invalid password',
							pageTitle !== (await driver.getTitle()) &&
								pageUrl !== (await driver.getCurrentUrl()),
						]);
						await driver.takeScreenshot().then(function (image, getResult) {
							fs.writeFile(
								'img/invaliduserpassword.png',
								image,
								'base64',
								function (getResult) {
									console.log(getResult);
								}
							);
						});
						await driver.navigate().refresh();
					};
					await invalidUserPassword();

					const validLogin = async () => {
						//  console.log("Checking the signIn Page - with valid logins");
						let pageTitle = await driver.getTitle();
						let pageUrl = await driver.getCurrentUrl();
						let email_id = await driver.findElement(
							By.css('input[type="email"]')
						);
						let signInButton = await driver.findElement(
							By.className('btn-primary')
						);
						let user_password = await driver.findElement(
							By.css('input[type="password"]')
						);
						//   console.log("checking with valid username and password");
						await email_id.sendKeys('vijay@credibled.com');
						await user_password.sendKeys('test@2025');
						await driver.takeScreenshot().then(function (image, getResult) {
							fs.writeFile(
								'img/validlogin.png',
								image,
								'base64',
								function (getResult) {
									console.log(getResult);
								}
							);
						});
						await signInButton.click();

						setTimeout(async () => {
							//    console.log("Test 5:Is user logged in with valid username and password", pageUrl !== await driver.getCurrentUrl());
							testArr.push([
								'Test 4:Is user logged in with valid username and password',
								pageUrl !== (await driver.getCurrentUrl()),
							]);
							await driver.takeScreenshot().then(function (image, getResult) {
								fs.writeFile(
									'img/homepage.png',
									image,
									'base64',
									function (getResult) {
										console.log(getResult);
									}
								);
							});
							HomePageTest();
						}, 2000);
					};
					await validLogin();
				};
			};
			blankInputCheck(); //all inputs check

			const HomePageTest = async () => {
				let currUrl = await driver.getCurrentUrl();
				const clickOperations = async () => {
					const backAndForward = async () => {
						//triggers the user pressing the back and the forward key
						setTimeout(async () => {
							let pageTitle = await driver.getTitle();
							// console.log("pageTitle",pageTitle);
							let pageUrl = await driver.getCurrentUrl();
							// console.log("page url",pageUrl);
							await driver.navigate().back();
							await driver.navigate().forward();
							//   console.log("Test 7: The user stays signed in on pressing back and forward button", pageTitle === await driver.getTitle() && pageUrl === await driver.getCurrentUrl());
							testArr.push([
								'Test 5: The user stays signed in on pressing back and forward button',
								pageTitle === (await driver.getTitle()) &&
									pageUrl === (await driver.getCurrentUrl()),
							]);
						}, 4000);
					};
					const clickInProgress = async () => {
						//   console.log("click operations--click on new-request-page");
						let pageUrl = await driver.getCurrentUrl();
						let newRequestButton = await driver.findElement(
							By.className('or_bg')
						);
						await newRequestButton.click();
						setTimeout(async () => {
							testArr.push([
								'Test 6:: is New Request accessible',
								pageUrl !== (await driver.getCurrentUrl()),
							]);
						}, 5000);
						setTimeout(async () => {
							await driver.navigate().back();
							testArr.push([
								'Test 7:: does user comes backs to the previous page after clicking back',
								pageUrl === (await driver.getCurrentUrl()),
							]);
						}, 6500);
					};
					//  logMeOut(); //uncomment to test this
					await backAndForward();
					clickInProgress();
					setTimeout(async () => {
						let pageUrl = await driver.getCurrentUrl();
						let adata = await driver.get(baseURL + '/home/questionnaires');
						testArr.push([
							'Test 8: is user clicked on questionnaire and is accessible--',
							pageUrl !== (await driver.getCurrentUrl()),
						]);
						// console.log("Test 10: is user clicked on questionnaire and is accessible--", pageUrl !== await driver.getCurrentUrl())
					}, 7500);

					setTimeout(async () => {
						let pageUrl = await driver.getCurrentUrl();
						let adata = await driver.get(baseURL + '/home/settings');
						testArr.push([
							'Test 9: is user clicked on settings and is accessible--',
							pageUrl !== (await driver.getCurrentUrl()),
						]);
						//  console.log("Test 11: is user clicked on settings and is accessible--", pageUrl !== await driver.getCurrentUrl())
					}, 8500);

					setTimeout(async () => {
						let pageUrl = await driver.getCurrentUrl();
						let adata = await driver.get(baseURL + '/home/requests');
						testArr.push([
							'Test 10: is user clicked on homepage and is accessible--',
							pageUrl !== (await driver.getCurrentUrl()),
						]);
						//  console.log("Test 11: is user clicked on homepage and is accessible--", pageUrl !== await driver.getCurrentUrl())
					}, 9500);
				};

				setTimeout(async () => {
					let pageUrl = await driver.getCurrentUrl();
					var links = await driver.findElement(
						By.className('tile-in-progress')
					);
					await links.click();
					//  let adata= await driver.get(baseURL+'/home/requests');
					testArr.push([
						'Test 11: inprogress clicked and is accessible--',
						pageUrl !== (await driver.getCurrentUrl()),
					]);
					//   console.log("Test 12: inprogress clicked and is accessible--", pageUrl !== await driver.getCurrentUrl())
				}, 11500);

				setTimeout(async () => {
					let pageUrl = await driver.getCurrentUrl();
					var links = await driver.findElement(By.className('tile-completed'));
					await links.click();
					testArr.push([
						'Test 12: completed clicked and is accessible--',
						pageUrl !== (await driver.getCurrentUrl()),
					]);
					//  let adata= await driver.get(baseURL+'/home/requests');
					// console.log("Test 13: completed clicked and is accessible--", pageUrl !== await driver.getCurrentUrl())
				}, 12500);

				setTimeout(async () => {
					let pageUrl = await driver.getCurrentUrl();
					var links = await driver.findElement(By.className('tile-archived'));
					await links.click();
					testArr.push([
						'Test 13: archived clicked and is accessible--',
						pageUrl !== (await driver.getCurrentUrl()),
					]);
					//  let adata= await driver.get(baseURL+'/home/requests');
					//   console.log("Test 15: archived clicked and is accessible--", pageUrl !== await driver.getCurrentUrl())
				}, 13500);

				setTimeout(async () => {
					let pageUrl = await driver.getCurrentUrl();
					var links = await driver.findElement(By.className('tile-requested'));
					await links.click();
					testArr.push([
						'Test 14: requested clicked and is accessible--',
						pageUrl !== (await driver.getCurrentUrl()),
					]);
					//  let adata= await driver.get(baseURL+'/home/requests');
					console.table(testArr);
					//  console.log("Test 15: requested clicked and is accessible--", pageUrl !== await driver.getCurrentUrl())
				}, 14500);

				//check the filterOperations

				setTimeout(async () => {
					console.log(
						'Test 15: Filter and dropdowns tests will be added later'
					);
				}, 15000);

				clickOperations();
			};

			// validLogin();

			// await driver.quit();
		} catch (err) {
			// console.log("website not reachable",err); //uncomment to see the error
			console.log('Test 1: website not reachable');
		}
	};
	//uncomment the below
	await clientNavigation();

	//Test 2:
	//tests on admin register

	const AdminRegisterTests = async () => {
		try {
			let getResult = await driver.get(baseURL + '/admin/register');
			console.log('Test 1:: Admin Register website reachable');
			setTimeout(async () => {
				let click = await driver.findElement(By.className('btn btn-primary'));
				click.click();
				let errorData = await driver.findElement(By.className('notes'));
				if (errorData !== null) {
					console.log(
						'Test 2: No Inputs entered/user routed to next page:',
						errorData.length > 0
					);
				}
				let firstName = await driver.findElement(By.id('first-name'));
				await firstName.sendKeys('vijay%%%$$');
				click.click();
				await firstName.sendKeys('-VK');
				let secondName = await driver.findElement(By.id('last-name'));
				await secondName.sendKeys(' Kumar');

				let countryName = await driver.findElement(By.id('selectCountry'));
				await countryName.click();
				setTimeout(async () => {
					let countryOptions = await driver.findElement(
						By.id('select-country')
					);
					//  await countryOptions.click()
					await countryOptions.sendKeys('Canada');
					setTimeout(async () => {
						let state_value = await driver.findElement(By.id('state-value'));
						await state_value.click();
						await state_value.sendKeys('Ontario');
						setTimeout(async () => {
							let click = await driver.findElement(
								By.className('btn btn-primary')
							);
							click.click();
							let state_value = await driver.findElement(
								By.css('input[type="email"]')
							);
							await state_value.sendKeys('vijay@credibled.com');
							await click.click();
							setTimeout(async () => {
								try {
									let state_value = await driver.findElement(
										By.id('email-value')
									);
									console.log(
										'Test 2: On Invalid inputs it moves to the next page',
										false
									);
								} catch (err) {
									console.log(
										'Test 2: On valid inputs it moves to the next page',
										true
									);
									setTimeout(async () => {
										let pageUrl = await driver.getCurrentUrl();
										// console.log("enter the second-page data");
										let firstName = await driver.findElement(
											By.id('organization-value')
										);
										await firstName.sendKeys('Any Org');
										let phone_number = await driver.findElement(
											By.id('phone-value')
										);
										await phone_number.sendKeys('1111111112');
										let pass_word = await driver.findElement(
											By.id('password-value')
										);
										await pass_word.sendKeys('1234567');
										let state_value = await driver.findElement(
											By.id('employees-value')
										);
										await state_value.click();
										await state_value.sendKeys('1-20');
										await state_value.click();
										let checkbox = await driver.findElement(
											By.id('checkBoxReview')
										);
										await checkbox.click();
										let btnCreateAccount = await driver.findElement(
											By.id('btnCreateAccount')
										);
										await btnCreateAccount.click();
										// console.log(pageUrl,await driver.getCurrentUrl())
										setTimeout(async () => {
											let bool_value =
												pageUrl !== (await driver.getCurrentUrl());
											console.log('Test 3: Is user signed up', bool_value);
											if (bool_value) {
												console.log(
													'Test 4: Is user on the reverify mail page',
													bool_value
												);
												setTimeout(async () => {
													let resend = await driver.findElement(
														By.id('resend')
													);
													resend.click();
													console.log(
														'Test 5: is the resend button working',
														true
													); //to be worked on the logic later
												}, 40000);
											}
										}, 1000);
									}, 2000);
								}
							}, 4000);
						}, 3000);
					}, 2000);
				}, 1000);
			}, 3000);
		} catch (err) {
			console.log('unreachable page');
		}
		console.log('other tests here');
	};

	//uncomment below to test AdminRegister functionality
	// await AdminRegisterTests(); //uncomment this function execution

	const forgotPasswordTests = async () => {
		console.log('checks forgot password functionality');
	};
	//forgotPasswordTests()

	const checkPageAccess = async () => {
		console.log(
			"checks if all the pages are routed the signin page if the user isn't signed"
		);
	};
	// console.log(data_test)
	//  await fsPromises.writeFile('data3.txt', 'Website Reachable');
};

//uncomment below to start test
openFireFoxTest();

const openChromeTest = async () => {
	const service = new chrome.ServiceBuilder(
		'./chromedriver_win32/chromedriver.exe'
	);
	const driver = new Builder()
		.forBrowser('chrome')
		.setChromeService(service)
		.build();

	try {
		await driver.get('http://localhost:3000/');
	} catch (err) {
		console.log('website not reachable');
	}
	await driver.getTitle();

	//const valid login function
	await driver.quit();
};
