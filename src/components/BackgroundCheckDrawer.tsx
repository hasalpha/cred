import React from 'react';
import Box from '@mui/material/Box/Box';
import Divider from '@mui/material/Divider/Divider';
import Drawer from '@mui/material/Drawer/Drawer';
import IconButton from '@mui/material/IconButton/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography/Typography';
import BackgroundCheckStatusCard from './BackgroundCheckStatusCard';
import type { DrawerContent } from '../pages/user/background-check';

export default function BackgroundCheckDrawer({
	isOpen,
	setIsDrawerOpen,
	closeDrawer,
	drawerContent,
}: {
	isOpen: boolean;
	setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
	closeDrawer: () => void;
	drawerContent: DrawerContent;
}) {
	const { email, uuid } = drawerContent;
	const statusString = `${
		drawerContent.drawerData.filter(v => v.status.toLowerCase() === 'complete')
			.length
	} of ${
		drawerContent.drawerData.length
	} Submitted - Last updated ${drawerContent.date.toDateString()}`;

	return (
		<Drawer
			anchor='right'
			open={isOpen}
			onClose={() => setIsDrawerOpen(false)}
			className='z-[1500]'
		>
			<Box className='flex items-center justify-between'>
				<Typography
					variant='h5'
					p={2}
				>
					Application Details
				</Typography>
				<IconButton
					color='secondary'
					onClick={closeDrawer}
				>
					<CloseIcon />
				</IconButton>
			</Box>
			<Divider />
			<Box m={2}>
				<Typography color='gray'>{email}</Typography>
			</Box>
			<Box p={2}>
				<BackgroundCheckStatusCard
					{...{ drawerContent: drawerContent?.drawerData[0], statusString }}
					uuid={uuid}
				/>
			</Box>
			<Box
				height='100%'
				className='flex flex-col gap-5 bg-slate-200 p-3'
			>
				{drawerContent?.drawerData?.map?.(v => (
					<BackgroundCheckStatusCard
						{...{ drawerContent: v }}
						secondary
						key={v.id}
						uuid={uuid}
					/>
				))}
			</Box>
		</Drawer>
	);
}
