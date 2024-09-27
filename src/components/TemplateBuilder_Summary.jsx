import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { API } from '../Api';
import logo from '../assets/img/credibled_logo_205x45.png';

function TB_Summary() {
	const [token, , deleteToken] = useCookies(['credtoken']);
	useEffect(() => {});

	const getCookie = name => {
		var cookieArr = document.cookie.split(';');
		for (var i = 0; i < cookieArr.length; i++) {
			var cookiePair = cookieArr[i].split('=');
			if (name == cookiePair[0].trim()) {
				return decodeURIComponent(cookiePair[1]);
			}
		}

		return null;
	};

	const signOutClicked = () => {
		API.logout(token['credtoken'])
			.then(resp => {
				if (resp.message === 'success') {
					localStorage.removeItem('creduser');
					localStorage.removeItem('creduser-a');
					deleteToken(['credtoken'], { path: '/' });
				}
			})
			.catch(error => console.error(error));
	};

	return (
		<div>
			<div className='container-fluid'>
				<div className='row'>
					<div className='col-6 bg-primary text-left'>&nbsp;</div>
					<div className='col-6 bg-secondary text-right'>&nbsp;</div>
				</div>
			</div>
			<div className='wrapper'>
				<div className='main-panel w100'>
					<div className='content'>
						<div className='container-fluid'>
							<div className='row'>
								<div className='col-md-10 offset-md-1'>
									<nav className='navbar navbar-expand navbar-transparent navbar-absolute fixed-top mobile_logo'>
										<div className='container-fluid'>
											<div className='logo'>
												<a
													className='navbar-brand'
													href='/'
												>
													<img
														src={logo}
														className='mob_logo'
														alt='Credibled Logo'
													/>
												</a>
												<div className='nomobile fl-right'>
													<h5>Questionnaire Builder</h5>
												</div>
											</div>

											<div className='text-right'>
												<ul className='navbar-nav mobile_nav'>
													{/**<li className="nav-item dropdown">
                            <a
                              className="nav-link dropdown-toggle"
                              href="#!"
                              id="navbarDropdownMenuLink"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              <i className="material-icons">language</i>
                              <span className="nomobile"> Language</span> (EN)
                            </a>
                            <div
                              className="dropdown-menu"
                              aria-labelledby="navbarDropdownMenuLink"
                            >
                              <a
                                className="dropdown-item"
                                href="javascript:void(0)"
                              >
                                English
                              </a>
                              <a
                                className="dropdown-item"
                                href="javascript:void(0)"
                              >
                                French
                              </a>
                            </div>
                          </li> */}
													<li className='nav-item dropdown'>
														<a
															className='nav-link dropdown-toggle'
															href='javascript:void(0)'
															id='navbarDropdownMenuLink'
															data-toggle='dropdown'
															aria-haspopup='true'
															aria-expanded='false'
														>
															<i className='material-icons'>account_box</i> Hi{' '}
															<span className='text-secondary'>
																{localStorage.getItem('email')
																	? localStorage
																			.getItem('email')
																			.substring(
																				0,
																				localStorage
																					.getItem('email')
																					.indexOf('@')
																			)
																	: 'There'}
															</span>
														</a>
														<div
															className='dropdown-menu'
															aria-labelledby='navbarDropdownMenuLink'
														>
															{/* <a
                                className="dropdown-item"
                                href="credibled_terms.html"
                                target="_new"
                              >
                                Terms of use
                              </a>
                              <a
                                className="dropdown-item"
                                href="credibled_privacy.html"
                                target="_new"
                              >
                                Privacy Policy
                              </a> */}
															<a
																className='dropdown-item'
																href='#!'
																onClick={signOutClicked}
															>
																Sign out
															</a>
														</div>
													</li>
												</ul>
											</div>
										</div>
									</nav>

									<div className='card-plain mt3'>
										<div className='row'>
											<div className='col-md-7 mt3 offset-md-2 text-center'>
												<h3 className='text-primary no-pt2 pt2'>
													Awesome{' '}
													<span className='text-secondary'>
														{localStorage.getItem('firstName')}!
													</span>
													&nbsp;your template has been added to your Credibled
													Questionnaires.{' '}
												</h3>
												<br />
												<Link
													to={{
														pathname: '/home/questionnaires',
														search: '',
														hash: '',
														state: { fromTemplateBuilder: true },
													}}
												>
													Back to Questionnaire Page
												</Link>
											</div>
										</div>
									</div>
								</div>
								<div className='clearfix'></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default TB_Summary;
