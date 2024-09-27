import '../assets/css/customContacts.css';
import AddIcon from '@mui/icons-material/Add';
import { CustomToolTip } from './CustomToolTip';
import EditIcon from '@mui/icons-material/BorderColorRounded';

import {
	contactsGetAPI,
	contactsPostAPI,
	contactsPutAPI,
	contactsDeleteAPI,
} from '../apis';

import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

// Typescript Types...
type Contact = {
	uuid: string;
	createdAt?: string;
	created_at?: string;
	name: string;
	title: string;
	email: string;
	isccresults?: boolean;
	cc_on_results?: boolean;
};
type ContactsList = Contact[];

function Contacts() {
	// Collected Sent data from the previous Page | State...
	const location = useLocation();

	// Contacts List Details | State...
	const [contactListSizeLimit, SetContactListSizeLimit] = useState<number>(6);
	const [isContactsList, SetIsContactsList] = useState<boolean>(false);
	const [contactsList, setContactsList] = useState<ContactsList>(() => []);
	// Checking (Add New Contact or Change Existing Contact) | State...
	const [isNewSave, setIsNewSave] = useState<boolean>(true);
	// Contact Form Details | State...
	const [contactsHeading, setContactsHeading] = useState<string>(
		() => 'Add a Contact'
	);
	const [contactSelectEdit, setContactSelectEdit] = useState<ContactsList>(
		() => []
	);
	const [cNameForm, setCNameForm] = useState<string>('');
	const [cTitleForm, setCTitleForm] = useState<string>('');
	const [cEmailForm, setCEmailForm] = useState<string>('');
	const [isCCCResults, setIsCCCResults] = useState<boolean>(true);
	const [isCEmailDuplicate, setIsCEmailDuplicate] = useState<boolean>(false);
	// Contact Selected Card | State...
	const [cSelectedUUID, setCSelectedUUID] = useState<string>('');
	// All Contact Card | State...
	const [isCEditDisabled, setIsCEditDisabled] = useState<boolean>(false);
	// Controls UI | State...
	const [isNoContactUI, setIsNoContactUI] = useState<boolean>(true);
	const [isAddContactUI, setIsAddContactUI] = useState<boolean>(() => {
		const { isOpenAddContact } = location.state || {};
		Boolean(isOpenAddContact)
			? setIsNoContactUI(false)
			: setIsNoContactUI(true);
		return Boolean(isOpenAddContact);
	});
	// ClassName Add & Remove (Tracker) | State...
	const [isCNameErrorCLASS, SetIsCNameErrorCLASS] = useState<boolean>(false);
	const [isCTitleErrorCLASS, SetIsCTitleErrorCLASS] = useState<boolean>(false);
	const [isCEmailErrorCLASS, SetIsCEmailErrorCLASS] = useState<boolean>(false);
	// ClassName Add & Remove (Tracker)...
	let CNameFieldErrorCLASS = isCNameErrorCLASS ? ' contactsFieldFormError' : '';
	let CTitleFieldErrorCLASS = isCTitleErrorCLASS
		? ' contactsFieldFormError'
		: '';
	let CEmailFieldErrorCLASS = isCEmailErrorCLASS
		? ' contactsFieldFormError'
		: '';
	let CNameMSGErrorCLASS = !isCNameErrorCLASS ? ' contactsMSGFormError' : '';
	let CTitleMSGErrorCLASS = !isCTitleErrorCLASS ? ' contactsMSGFormError' : '';
	let CEmailMSGErrorCLASS = !isCEmailErrorCLASS ? ' contactsMSGFormError' : '';
	let CAddDisableBtnCLASS =
		!isContactsList || contactsList.length >= contactListSizeLimit
			? ' contactsAddIconDisabled'
			: '';

	// Get data from apis when the site loaded & clear the local existing data...
	useEffect(() => {
		(async () => {
			try {
				// Get Request...
				const getAPI = await contactsGetAPI();
				if (getAPI.status !== 200) {
					toast.error('Pls, Try again later API error!');
					return;
				}
				const getAPIData = getAPI.data.results;

				// Display Contacts...
				setContactsList([]);
				setContactsList((prevContactsList: ContactsList) => {
					return [
						...prevContactsList,
						...getAPIData.map((getAPIData: Contact) => ({
							uuid: getAPIData.uuid,
							createdAt: getAPIData.created_at,
							name: getAPIData.name,
							title: getAPIData.title,
							email: getAPIData.email,
							isccresults: getAPIData.cc_on_results,
						})),
					].sort(
						(a, b) =>
							new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
					);
				});
				SetIsContactsList(true);
			} catch (e) {
				toast.error('Pls, Try again later API error!');
			}
		})();
	}, []);

	// Toggle Add to Contacts & No Contact display message... Toggle{True -> To show Add to contact, False -> To hide Add to contact}
	const contactsAddToggleBtn = (
		toggle: boolean,
		e?: React.MouseEvent<HTMLButtonElement | SVGSVGElement, MouseEvent>
	): void => {
		if (e && typeof e.preventDefault === 'function') {
			e.preventDefault();
		}
		setIsNoContactUI(!toggle);
		setIsAddContactUI(toggle);
		SetIsCNameErrorCLASS(false);
		SetIsCTitleErrorCLASS(false);
		SetIsCEmailErrorCLASS(false);
	};

	const contactsAddIconBtn = (
		e: React.MouseEvent<HTMLButtonElement | SVGSVGElement, MouseEvent>
	): void => {
		if (!isContactsList || contactsList.length >= contactListSizeLimit) return;
		setContactsHeading('Add a Contact');
		contactFormReset();
		setIsNewSave(true);
		contactsAddToggleBtn(true, e);
	};

	// To Reset the Form State...
	const contactFormReset = (): void => {
		setIsCEmailDuplicate(false);
		setCSelectedUUID('');
		setCNameForm('');
		setCTitleForm('');
		setCEmailForm('');
		setIsCCCResults(true);
		SetIsCNameErrorCLASS(false);
		SetIsCTitleErrorCLASS(false);
		SetIsCEmailErrorCLASS(false);
	};

	// Onclick Add to Contact save button.
	const contactsSaveBtn = async (
		e: React.FormEvent<HTMLFormElement>
	): Promise<void> => {
		try {
			e.preventDefault();
			// Validation...
			setIsCEmailDuplicate(false);
			const ContactsEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			const isCEmailvalid = ContactsEmailPattern.test(cEmailForm);
			const CNameInvalid =
				cNameForm === ''
					? (SetIsCNameErrorCLASS(true), true)
					: (SetIsCNameErrorCLASS(false), false);
			const CTitleInvalid =
				cTitleForm === ''
					? (SetIsCTitleErrorCLASS(true), true)
					: (SetIsCTitleErrorCLASS(false), false);
			const CEmailInvalid =
				cEmailForm === '' || !isCEmailvalid
					? (SetIsCEmailErrorCLASS(true), true)
					: (SetIsCEmailErrorCLASS(false), false);
			if (CNameInvalid || CTitleInvalid || CEmailInvalid) return;

			if (isNewSave === true && contactsList.length < contactListSizeLimit) {
				// Checking for email duplicate for New Save alone...
				const isCEmailDuplicate1 = contactsList.some(
					(contact: Contact) => contact.email === cEmailForm
				);
				setIsCEmailDuplicate(isCEmailDuplicate1);

				const CNewEmailInvalid = isCEmailDuplicate1
					? (SetIsCEmailErrorCLASS(true), true)
					: (SetIsCEmailErrorCLASS(false), false);
				if (CNewEmailInvalid) return;

				// Post Request...
				const postAPI = await contactsPostAPI(
					cNameForm,
					cTitleForm,
					cEmailForm,
					isCCCResults
				);
				if (postAPI.status !== 200) {
					toast.error('Pls, Try again later API error!');
					return;
				}
				toast.success('Contact Added successfully!');

				// Display Contacts...
				setContactsList((prevContactsList: ContactsList) => {
					return [
						...prevContactsList,
						{
							uuid: postAPI.data.uuid,
							createdAt: postAPI.data.created_at,
							name: postAPI.data.name,
							title: postAPI.data.title,
							email: postAPI.data.email,
							isccresults: postAPI.data.cc_on_results,
						},
					];
				});
				contactFormReset();
				setIsAddContactUI(false);
			} else {
				const isCEmailDuplicate = contactsList.some(
					(contact: Contact) => contact.email === cEmailForm
				);
				const CNewEmailInvalid =
					isCEmailDuplicate && contactSelectEdit[0].email !== cEmailForm
						? (SetIsCEmailErrorCLASS(true), true)
						: (SetIsCEmailErrorCLASS(false), false);

				setIsCEmailDuplicate(CNewEmailInvalid);
				if (CNewEmailInvalid) return;

				// Put Request - Modify data...
				const putAPI = await contactsPutAPI(
					cSelectedUUID,
					cNameForm,
					cTitleForm,
					cEmailForm,
					isCCCResults
				);
				if (putAPI.status !== 200) {
					toast.error('Pls, Try again later API error!');
					return;
				}
				toast.success('Contact Edited successfully!');

				// Display Contacts...
				setContactsList((prevContactList: ContactsList) => {
					return prevContactList.map((contact: Contact) => {
						return contact.uuid === cSelectedUUID
							? {
									...contact,
									name: putAPI.data.name,
									title: putAPI.data.title,
									email: putAPI.data.email,
								}
							: contact;
					});
				});
				contactFormReset();
				setContactSelectEdit([]);
				setIsAddContactUI(false);
			}
		} catch (e) {
			toast.error('Pls, Try again later API error!');
		}
	};

	// Toggles CC On Result individually for saved contacts...
	const contactsCCResultToggle = async (
		data: Contact,
		checked: boolean
	): Promise<void> => {
		try {
			// Display Contacts...
			contactFormReset();
			contactsAddToggleBtn(false);
			setIsCEditDisabled(true);
			setCSelectedUUID(data.uuid);
			setContactsList((prevContactsList: ContactsList) => {
				return prevContactsList.map((contact: Contact) => {
					return contact.uuid === data.uuid
						? { ...contact, isccresults: checked }
						: contact;
				});
			});

			// Put Request - Modify data...
			const putApi = await contactsPutAPI(
				data.uuid,
				data.name,
				data.title,
				data.email,
				!data.isccresults ? true : false
			);
			if (putApi.status !== 200) {
				toast.error('Pls, Try again later API error!');
				setContactsList((prevContactsList: ContactsList) => {
					return prevContactsList.map((contact: Contact) => {
						return contact.uuid === data.uuid
							? { ...contact, isccresults: !checked }
							: contact;
					});
				});
				setCSelectedUUID('');
				setIsCEditDisabled(false);
				return;
			}

			toast.success('Contact Edited successfully!');

			setCSelectedUUID('');
			setIsCEditDisabled(false);
		} catch (e) {
			toast.error('Pls, Try again later API error!');
		}
	};

	// OnClick Edit button of specific contact card...
	const contactsEditBtn = (
		data: Contact,
		e: React.MouseEvent<SVGSVGElement, MouseEvent>
	): void => {
		e.preventDefault();
		if (!isCEditDisabled) {
			contactFormReset();
			setIsNewSave(false);
			setIsAddContactUI(true);
			setCSelectedUUID(data.uuid);
			setContactsHeading(`Edit Contact`);
			setContactSelectEdit([
				{
					uuid: data.uuid,
					createdAt: data.created_at,
					name: data.name,
					title: data.title,
					email: data.email,
					isccresults: data.cc_on_results,
				},
			]);
			setCNameForm(data.name);
			setCTitleForm(data.title);
			setCEmailForm(data.email);
			setIsCCCResults(data.isccresults ? true : false);
		}
	};

	// OnClick Delete button, Remove card and delete record in DB.
	const contactsDeleteBtn = async (
		e: React.MouseEvent<HTMLElement, MouseEvent>
	): Promise<void> => {
		try {
			e.preventDefault();
			// Delete Request...
			const deleteAPI = await contactsDeleteAPI(cSelectedUUID);
			if (deleteAPI.status !== 204) {
				toast.error('Pls, Try again later API error!');
				return;
			}
			toast.success('Contact Deleted successfully!');

			// Display Contacts...
			setContactsList((prevContactsList: ContactsList) => {
				const contacts = prevContactsList.filter(
					(contact: Contact) => contact.uuid !== cSelectedUUID
				);
				if (contacts.length === 0) setIsNoContactUI(true);
				return contacts;
			});
			contactFormReset();
			setIsAddContactUI(false);
		} catch (e) {
			toast.error('Pls, Try again later API error!');
		}
	};

	return (
		<>
			{/* Contacts Header */}
			<div>
				<div className='contactsHeader'>
					<h3>
						Contacts
						<CustomToolTip
							className=''
							content={
								'Adding a contact enables you to easily share results with them. Choose to either share results automatically with added contacts or manually select recipients each time from the request page.'
							}
						/>{' '}
					</h3>
					<span className='contactsLimitCounter'>{`${contactsList.length}/${contactListSizeLimit}`}</span>
					<AddIcon
						className={`contactsAddIcon${CAddDisableBtnCLASS}`}
						sx={{ stroke: '#ffffff', strokeWidth: 2.5 }}
						onClick={e => {
							contactsAddIconBtn(e);
						}}
					/>
				</div>
				<div className='contacts_HLine'></div>
			</div>

			{/* No Contacts Saved */}
			{contactsList.length > 0 || !isNoContactUI ? (
				''
			) : (
				<div className='contactsNoSavedSection'>
					<div className='contactsNoSaved'>
						You don’t have any saved contacts yet. Please add a contact to share
						PDF results of reference checks via email. You can set sharing to
						automatic or manual.
					</div>
					<button
						className='contactsAddButton'
						onClick={e => {
							contactsAddIconBtn(e);
						}}
					>
						Add a contact
					</button>
				</div>
			)}

			{/* Add a Contact */}
			{!isAddContactUI ? (
				''
			) : (
				<div className='contactsAddSection'>
					<div className='contactsAddForm'>
						<h3>{contactsHeading}</h3>
						<form onSubmit={e => contactsSaveBtn(e)}>
							{isNewSave ? (
								''
							) : (
								<i
									className='fa fa-trash fa-lg contactsDeleteIcon'
									onClick={e => contactsDeleteBtn(e)}
								/>
							)}

							<div className='contactsFormDetails contactsFormDetails_A'>
								<div>
									<label htmlFor='CName'>
										Name <span>*</span>
									</label>
									<br />
									<input
										type='text'
										name='CName'
										id='CName'
										className={`contactsFormField${CNameFieldErrorCLASS}`}
										placeholder='Steve Rogers'
										value={cNameForm}
										onChange={e => setCNameForm(e.currentTarget.value)}
									/>
									<div
										id='contactsError'
										className={`notes${CNameMSGErrorCLASS}`}
									>
										New Name is required
									</div>
								</div>
								<div>
									<label htmlFor='CTitle'>
										Title <span>*</span>
									</label>
									<br />
									<input
										type='text'
										name='CTitle'
										id='CTitle'
										className={`contactsFormField${CTitleFieldErrorCLASS}`}
										placeholder='Buissness Team Manager'
										value={cTitleForm}
										onChange={e => setCTitleForm(e.currentTarget.value)}
									/>
									<div
										id='contactsError'
										className={`notes${CTitleMSGErrorCLASS}`}
									>
										New Title is required
									</div>
								</div>
							</div>

							<div className='contactsFormDetails contactsFormDetails_B'>
								<div>
									<label htmlFor='CEmail'>
										Email <span>*</span>
									</label>
									<input
										type='email'
										name='CEmail'
										id='CEmail'
										className={`contactsFormField${CEmailFieldErrorCLASS}`}
										placeholder='steverogers@email.com'
										value={cEmailForm}
										onChange={e => setCEmailForm(e.currentTarget.value)}
									/>
									<div
										id='contactsError'
										className={`notes${CEmailMSGErrorCLASS}`}
									>
										{isCEmailDuplicate
											? 'The email address you entered is already associated with another contact. Please use a different email address.'
											: 'New Email is required'}
									</div>
								</div>
								{!isNewSave ? (
									''
								) : (
									<div>
										<label
											htmlFor='CCCResults'
											className='contactsFormCCText'
										>
											Always CC
											<span className='contactsFormCCTextBR'>
												<br />
											</span>{' '}
											on Results
										</label>
										<label className='contactsToggleBtn'>
											<input
												type='checkbox'
												name='CCCResults'
												checked={isCCCResults}
												onChange={e => setIsCCCResults(e.currentTarget.checked)}
											/>
											<span className='contactsSlider round'></span>
										</label>
									</div>
								)}
							</div>

							<button
								type='reset'
								className='contactsAddBtn'
								onClick={e => {
									setCSelectedUUID('');
									contactsAddToggleBtn(false, e);
								}}
							>
								Cancel
							</button>
							<button
								type='submit'
								className='contactsAddBtn contactSubmitBtnColor'
							>
								Save
							</button>
						</form>
					</div>
				</div>
			)}

			{/* Contacts Saved Cards */}
			<div>
				<div className='contactsSavedSection'>
					{contactsList.map((data: Contact) => {
						return (
							<div
								key={data.uuid}
								className='contactsSavedCard'
							>
								{data.uuid !== cSelectedUUID ? (
									''
								) : (
									<div className='contactsOverlayCard'></div>
								)}

								<div className='contactsCardDetails'>
									<div>
										<h3>{data.name}</h3>
									</div>
									<div>
										<h4 className='contactsCardInfo'>{data.title}</h4>
										<h4 className='contactsCardInfo'>{data.email}</h4>
									</div>
								</div>
								<div>
									<EditIcon
										className='contentsEditIcon'
										onClick={e => contactsEditBtn(data, e)}
									/>
									<div>
										<label
											htmlFor='CCCResults'
											className='contactsCCResult'
										>
											Always CC
											<br />
											on Results
										</label>
										<label className='contactsToggleBtn contactsToggleBtnSize'>
											<input
												type='checkbox'
												name='CCCResults'
												checked={data.isccresults}
												onChange={e =>
													contactsCCResultToggle(data, e.currentTarget.checked)
												}
											/>
											<span className='contactsSlider round'></span>
										</label>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
}
export default Contacts;
