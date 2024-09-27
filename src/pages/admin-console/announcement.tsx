import '../../assets/css/customAnnouncement.css';
import PhReport from '../../assets/img/ph_reports.png';
import { Paper, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { bannerGetAPI, bannerPostAPI, bannerPutAPI } from '../../apis';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import BannerAnnouncementPopup from '../../components/banners/bannerAnnouncementPopup';

// Typescript Types...
type Banner = {
	uuid: string;
	createdAt: string;
	created_at?: string;
	title: string;
	description: string;
	isBannerActive: boolean;
	is_active?: boolean;
};
type BannersList = Banner[];

export default function SuperAdminAnnouncement() {
	// Banners List Details | State...
	const [isBannerList, setIsBannerList] = useState<boolean>(false);
	const [bannerList, setBannerList] = useState<BannersList>([]);
	// Banner Selected | State...
	const [isBannerActive, setIsBannerActive] = useState<boolean>(false);
	const [selBannerPreview, setSelBannerPreview] = useState<BannersList>([]);
	// Banners Form Details | State...
	const [isBTitleFormValid, setIsBTitleFormValid] = useState<boolean>(false);
	const [isBDescriptionFormValid, setIsBDescriptionFormValid] =
		useState<boolean>(false);
	const [bTitleForm, setBTitleForm] = useState<string>('');
	const [bDescriptionForm, setBDescriptionForm] = useState<string>('');
	// Banners UI | State...
	const [isAddNewBannerUI, setIsAddNewBannerUI] = useState<boolean>(false);

	// Get data from apis when the site loaded...
	useEffect((): void => {
		(async (): Promise<void> => {
			try {
				// Get Request...
				const getAPI = await bannerGetAPI();
				if (getAPI.status !== 200) {
					toast.error('Pls, Try again later API error!');
					return;
				}
				const getAPIData = getAPI.data.results;

				// Display Contacts...
				setBannerList([]);
				setBannerList((prevBannerList: BannersList) => {
					return [
						...prevBannerList,
						...getAPIData.map((getAPIData: Banner) => ({
							uuid: getAPIData.uuid,
							createdAt: getAPIData.created_at,
							title: getAPIData.title,
							description: getAPIData.description,
							isBannerActive: getAPIData.is_active,
						})),
					].sort(
						(a, b) =>
							new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
					);
				});
				setIsBannerList(true);
			} catch (e) {
				toast.error('Pls, Try again later API error!');
			}
		})();
	}, []);

	const formatDate = (dateString: string): string => {
		if (dateString) {
			let d = new Date(dateString);
			let time = new Intl.DateTimeFormat('en', {
				dateStyle: 'full',
				timeStyle: 'short',
			}).format(d);
			return time;
		}
		return 'null';
	};

	const bannerFormReset = (): void => {
		setBTitleForm('');
		setBDescriptionForm('');
		setIsBTitleFormValid(false);
		setIsBDescriptionFormValid(false);
	};

	const bannerAddToggleBtn = (
		toggle: boolean,
		e?: React.MouseEvent<HTMLButtonElement, MouseEvent>
	): void => {
		if (e && typeof e.preventDefault === 'function') {
			e.preventDefault();
		}
		setIsAddNewBannerUI(toggle);
		if (toggle) return;
		bannerFormReset();
	};

	async function bannerFormSaveBtn(
		e: React.FormEvent<HTMLFormElement>
	): Promise<void> {
		try {
			e.preventDefault();
			//Valid Input Form...
			bTitleForm === '' && setIsBTitleFormValid(true);
			bDescriptionForm === '' && setIsBDescriptionFormValid(true);
			if (bTitleForm === '' || bDescriptionForm === '') return;

			// Post Request...
			const postAPI = await bannerPostAPI(bTitleForm, bDescriptionForm, false);
			if (postAPI.status !== 200) {
				toast.error('Pls, Try again later API error!');
				return;
			}
			toast.success('Banner Added successfully!');

			// Display Contacts...
			setBannerList((prevBannerList: BannersList) => {
				return [
					{
						uuid: postAPI.data.uuid,
						createdAt: postAPI.data.created_at,
						title: postAPI.data.title,
						description: postAPI.data.description,
						isBannerActive: postAPI.data.is_active,
					},
					...prevBannerList,
				];
			});
			bannerAddToggleBtn(false);
		} catch (e) {
			toast.error('Pls, Try again later API error!');
		}
	}

	// Toggles CC On Result individually for saved contacts...
	const BannerStatusToggle = async (
		data: Banner,
		checked: boolean
	): Promise<void> => {
		try {
			// Display Contacts...
			bannerAddToggleBtn(false);
			const isAnyBannerActive = bannerList.some(
				(banner: Banner) => banner.isBannerActive
			);
			if (isAnyBannerActive && !data.isBannerActive) {
				toast.error(
					'A banner toggle is already active. Please deactivate it before selecting a new one.'
				);
				return;
			}
			setBannerList((prevBannerList: BannersList) => {
				return prevBannerList.map((banner: Banner) => {
					return banner.uuid === data.uuid
						? { ...banner, isBannerActive: checked }
						: banner;
				});
			});

			// Put Request - Modify data...
			const putApi = await bannerPutAPI(
				data.uuid,
				!data.isBannerActive ? true : false
			);
			if (putApi.status !== 200) {
				toast.error('Pls, Try again later API error!');
				setBannerList((prevBannerList: BannersList) => {
					return prevBannerList.map((banner: Banner) => {
						return banner.uuid === data.uuid
							? { ...banner, isBannerActive: !checked }
							: banner;
					});
				});
				return;
			}
			toast.success('Banner Edited successfully!');
		} catch (e) {
			toast.error('Pls, Try again later API error!');
		}
	};

	const bannerPreviewBtn = (
		data: Banner,
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	): void => {
		setSelBannerPreview([
			{
				uuid: data.uuid,
				createdAt: data.createdAt,
				title: data.title,
				description: data.description,
				isBannerActive: data.isBannerActive,
			},
		]);
		setIsBannerActive(true);
	};

	return (
		<>
			<div>
				{/* Heading Title... */}
				<div className='card-plain'>
					<div className='card-body'>
						<div className='row'>
							<div className='col-md-12'>
								<div className='card-plain bb10'>
									<div className='row'>
										<div className='col-md-4'>
											<h3> Banners List</h3>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Btn - Add New Banner... */}
				<div className='col text-right'>
					<button
						className='btn btn-secondary'
						onClick={e => bannerAddToggleBtn(true, e)}
					>
						Add New Banner
					</button>
					&nbsp;&nbsp;
				</div>
				<br />

				{/* Card - Add New Banner... */}
				{isAddNewBannerUI && (
					<div className='row-md-12'>
						<div className='col-md-12 lrpad'>
							<div className='card mt_zero pad_zero'>
								<div className='client-box'>
									<div className='column pt1'>
										<Paper
											elevation={0}
											className='px-0 py-0'
											square
											component='form'
											onSubmit={e => bannerFormSaveBtn(e)}
										>
											<h3 className='text-secondary'>Add New Banner</h3>
											<br />
											<TextField
												name='title'
												variant='outlined'
												type='text'
												required
												label='Title'
												fullWidth
												error={isBTitleFormValid}
												placeholder='Pls, Enter banner title!'
												value={bTitleForm}
												onChange={e => setBTitleForm(e.currentTarget.value)}
											/>
											<br />
											<br />
											<TextField
												required
												multiline
												name='description'
												variant='outlined'
												type='text'
												label='Description'
												rows={10}
												fullWidth
												error={isBDescriptionFormValid}
												placeholder='<div>Custom Html</div>'
												value={bDescriptionForm}
												onChange={e =>
													setBDescriptionForm(e.currentTarget.value)
												}
											/>
											<br />
											<div className='col-md-12'>
												<div className='col-md-12 mt3 pb2 text-center'>
													<LoadingButton
														variant='contained'
														color='secondary'
														type='submit'
													>
														Save
													</LoadingButton>
													<button
														type='reset'
														className='btn-plain'
														onClick={e => bannerAddToggleBtn(false, e)}
													>
														Close
													</button>
												</div>
											</div>
										</Paper>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Display all Banners... */}
				<div className='col-md-12 lrpad'>
					<div className='card mt_zero pad_zero'>
						{bannerList.length ? (
							<div className='table-responsive'>
								<div id='utable'>
									<br />
									<table className='table-hover table'>
										<thead>
											<tr>
												<th className='text-center'>#</th>
												<th className='sorting'>Title</th>
												<th className='sorting'>Created Date</th>
												<th className='sorting'>Status</th>
												<th className='sorting'>Preview</th>
											</tr>
										</thead>
										{bannerList.map((data: Banner, index: number) => {
											return (
												<tbody key={data.uuid}>
													<tr>
														<td className='text-center'>{index + 1}</td>
														<td>{data.title}</td>
														<td>{formatDate(data.createdAt)}</td>
														<td>
															<label className='bannersToggleBtn bannersToggleBtnSize'>
																<input
																	type='checkbox'
																	name='bannerActive'
																	checked={data.isBannerActive}
																	onChange={e =>
																		BannerStatusToggle(
																			data,
																			e.currentTarget.checked
																		)
																	}
																/>
																<span className='bannersSlider round'></span>
															</label>
														</td>
														<td>
															<div
																className='bannersPreviewBtn'
																onClick={e => bannerPreviewBtn(data, e)}
															>
																<i className='fa fa-eye'></i>
																&nbsp;&nbsp; View
															</div>
														</td>
													</tr>
												</tbody>
											);
										})}
									</table>
								</div>
							</div>
						) : (
							<div
								id='ph'
								className='text-center'
								style={{ margin: '5em 0' }}
							>
								<p>No Banner found!</p>
								<img
									src={PhReport}
									style={{ width: '30%', cursor: 'pointer' }}
									alt='PhReport'
								/>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Display Selected Banner Preview... */}
			{isBannerActive && (
				<BannerAnnouncementPopup
					selBannerView={selBannerPreview[0]}
					isPreviewBanner={true}
					setIsBannerActive={setIsBannerActive}
				/>
			)}
		</>
	);
}
