import { UserBannerGetAPI } from '../../apis';

import BannerAnnouncementPopup from '../../components/banners/bannerAnnouncementPopup';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

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

function ClientBannerView() {
	// Banner Details | State...
	const [isBannerActive, setIsBannerActive] = useState<boolean>(false);
	const [selBanner, setSelBanner] = useState<BannersList>([]);

	// Get data from apis when the site loaded...
	useEffect((): void => {
		(async (): Promise<void> => {
			try {
				// Get Request...
				const getAPI = await UserBannerGetAPI();
				if (getAPI.status !== 200) {
					toast.error('Pls, Try again later API error!');
					return;
				}
				const getAPIData = getAPI.data.results;

				// Display Contacts...
				const bannerList = getAPIData.map((getAPIData: Banner) => ({
					uuid: getAPIData.uuid,
					createdAt: getAPIData.created_at,
					title: getAPIData.title,
					description: getAPIData.description,
					isBannerActive: getAPIData.is_active,
				}));
				bannerDisplayHandle(bannerList);
			} catch (e) {
				toast.error('Pls, Try again later API error!');
			}
		})();
	}, []);

	// Banner Display Handle Logic...
	const bannerDisplayHandle = (bannerList: BannersList): void => {
		let isBannerList_StopLoop = false;

		// Display Banner, Load & save localStorage...
		try {
			bannerList.map(banner => {
				if (isBannerList_StopLoop) return;
				const getLSBannerTracker = JSON.parse(
					localStorage.getItem('bannerTracker') || '{}'
				);

				// Is localStorage Saved or not...
				Object.keys(getLSBannerTracker).length > 0
					? (() => {
							!getLSBannerTracker.isClickedOk &&
								banner.uuid === getLSBannerTracker.uuid &&
								banner.isBannerActive &&
								(() => {
									//2
									isBannerList_StopLoop = bannerShowToggle(banner, true);
								})();
							!getLSBannerTracker.isClickedOk &&
								banner.uuid === getLSBannerTracker.uuid &&
								!banner.isBannerActive &&
								localStorage.removeItem('bannerTracker');
							getLSBannerTracker.isClickedOk &&
								banner.isBannerActive === true &&
								banner.uuid !== getLSBannerTracker.uuid &&
								(() => {
									//3
									bannerLSSave(banner);
									isBannerList_StopLoop = bannerShowToggle(banner, true);
								})();
						})()
					: (() => {
							//1
							banner.isBannerActive === true &&
								(() => {
									bannerLSSave(banner);
									isBannerList_StopLoop = bannerShowToggle(banner, true);
								})();
						})();
			});
		} catch (e) {
			toast.error('Pls, Try again later!');
		}
	};

	// Banner localStorage | Save...
	const bannerLSSave = (banner: Banner): void => {
		localStorage.removeItem('bannerTracker');
		const data = {
			uuid: banner.uuid,
			isClickedOk: false,
		};
		localStorage.setItem('bannerTracker', JSON.stringify(data));
	};
	// Banner Display | Toggle...
	const bannerShowToggle = (
		banner: Banner,
		isBannerList_StopLoop: boolean
	): boolean => {
		setSelBanner([banner]);
		setIsBannerActive(true);
		return isBannerList_StopLoop;
	};

	return (
		<>
			{/* Display Announcement Banner to Users */}
			{isBannerActive && (
				<BannerAnnouncementPopup
					selBannerView={selBanner[0]}
					isPreviewBanner={false}
					setIsBannerActive={setIsBannerActive}
				/>
			)}
		</>
	);
}

export default ClientBannerView;
