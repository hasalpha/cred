import Card from '@mui/material/Card/Card';
import CardContent from '@mui/material/CardContent/CardContent';
import Typography from '@mui/material/Typography/Typography';
import AccessTimeTwoToneIcon from '@mui/icons-material/AccessTimeTwoTone';
import Box from '@mui/material/Box/Box';
import { DrawerData } from '../pages/user/background-check';
import { Link } from 'react-router-dom';

export default function BackgroundCheckStatusCard({
	uuid = '',
	secondary = false,
	drawerContent,
	statusString = '',
}: {
	uuid?: string;
	secondary?: boolean;
	drawerContent: DrawerData[number];
	statusString?: string;
}) {
	const isSuccess = drawerContent.status.toLowerCase().includes('complete');
	return (
		<Card
			variant='outlined'
			className='rounded-lg border'
		>
			{secondary ? (
				<CardContent className='flex flex-col gap-2 py-2 pl-3'>
					<Box
						className={`flex gap-1 ${
							isSuccess ? 'bg-green-200' : 'bg-orange-200'
						} w-fit rounded-lg px-[3px] pt-[3px]`}
					>
						<AccessTimeTwoToneIcon
							color={isSuccess ? 'success' : 'primary'}
							className='col-span-1 row-span-2'
							fontSize='small'
						/>
						<Typography
							className='text-sm font-bold capitalize text-gray-600'
							gutterBottom
						>
							{drawerContent.status.split('_').join(' ').toLowerCase()}
						</Typography>
					</Box>
					<Typography
						color='black'
						className='font-semibold capitalize'
					>
						{drawerContent.check_name.split('_').join(' ').toLowerCase()}
					</Typography>
				</CardContent>
			) : (
				<CardContent className='flex gap-2 py-2 pl-3'>
					<AccessTimeTwoToneIcon
						color={isSuccess ? 'success' : 'primary'}
						className='col-span-1 row-span-2'
					/>
					<Box>
						<Typography
							className='font-bold capitalize text-gray-950'
							gutterBottom
						>
							{drawerContent.status.split('_').join(' ').toLowerCase()}
							{drawerContent.status === 'COMPLETE' && (
								<Link
									to={uuid}
									className='float-right'
								>
									View Report
								</Link>
							)}
						</Typography>
						<Typography color='grey'>{statusString}</Typography>
					</Box>
				</CardContent>
			)}
		</Card>
	);
}
