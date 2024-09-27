import TabContext from '@mui/lab/TabContext/TabContext';
import TabList from '@mui/lab/TabList/TabList';
import Box from '@mui/material/Box/Box';
import { ReactNode } from 'react';

export default function TabMenu({
	tab,
	handleTabChange,
	children,
	className = '',
}: {
	tab: string;
	handleTabChange: (data: string) => void;
	children: ReactNode;
	className?: string;
}) {
	return (
		<Box
			sx={{ width: '100%', typography: 'body1' }}
			className={className}
		>
			<TabContext value={tab}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<TabList
						onChange={(_e, data) => handleTabChange(data)}
						aria-label='super admin menu bar'
						textColor='secondary'
						indicatorColor='secondary'
						variant='scrollable'
						scrollButtons
						allowScrollButtonsMobile
					>
						{children}
					</TabList>
				</Box>
			</TabContext>
		</Box>
	);
}
