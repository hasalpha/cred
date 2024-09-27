import Grid from '@mui/material/Grid/Grid';
import Typography from '@mui/material/Typography/Typography';

export function LogoTitleComponent({ title }: { title: string }) {
	return (
		<Grid
			container
			className='mb-12'
		>
			<Grid
				item
				xs={12}
				md={4}
				lg={6}
			>
				<img
					className='mob_logo credibled-logo'
					src='/credibled-logo.png'
					alt='credibled logo'
				/>
			</Grid>
			<Grid
				item
				xs={12}
				md={8}
				lg={6}
			>
				<Typography variant='h1'>{title}</Typography>
			</Grid>
		</Grid>
	);
}
