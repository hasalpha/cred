import React, { useState } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
} from '@mui/material';
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
type BannerAnnouncementPopupProps = {
	selBannerView: Banner;
	isPreviewBanner: boolean;
	setIsBannerActive: React.Dispatch<React.SetStateAction<boolean>>;
};

const BannerAnnouncementPopup: React.FC<BannerAnnouncementPopupProps> = ({
	selBannerView,
	isPreviewBanner,
	setIsBannerActive,
}) => {
	// Banner Close Btn...
	const bannerCloseBtn = (): void => {
		setIsBannerActive(false);
		if (isPreviewBanner) return;

		try {
			const getCookieBannerTracker = JSON.parse(
				localStorage.getItem('bannerTracker') || '{}'
			);

			// Is localStorage Saved or not && Save True if btn is pressed...
			Object.keys(getCookieBannerTracker).length > 0 &&
				(() => {
					const data = {
						uuid: getCookieBannerTracker.uuid,
						isClickedOk: true,
					};
					localStorage.setItem('bannerTracker', JSON.stringify(data));
				})();
		} catch (e) {
			toast.error('Pls, Try again later!');
		}
	};

	return (
		<Dialog
			open
			aria-labelledby='announcement-dialog-title'
			aria-describedby='announcement-dialog-description'
			maxWidth='sm'
			fullWidth
		>
			<DialogTitle id='announcement-dialog-title'>
				<div
					style={{ color: '#ed642b', textAlign: 'center' }}
					dangerouslySetInnerHTML={{ __html: selBannerView.title }}
				/>
			</DialogTitle>
			<DialogContent>
				<div dangerouslySetInnerHTML={{ __html: selBannerView.description }} />
			</DialogContent>
			<DialogActions>
				<Button
					onClick={bannerCloseBtn}
					color='secondary'
					variant='contained'
				>
					Okay, got it!
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default BannerAnnouncementPopup;
