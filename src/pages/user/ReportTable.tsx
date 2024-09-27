import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function DenseTable({
	headers = [],
	rows = [],
	headerClass = '',
}: {
	headers: Array<string>;
	rows: Array<Record<string, string>>;
	headerClass?: string;
}) {
	return (
		<TableContainer>
			<Table size='small'>
				<TableHead>
					<TableRow
						sx={{
							borderBottom: '2px solid lightgray',
						}}
					>
						{headers.map(v => (
							<TableCell className={'uppercase ' + headerClass}> {v}</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody className='capitalize'>
					{rows.map(row => (
						<TableRow key={row.name}>
							{Object.values(row).map((v = '') => (
								<TableCell
									className={
										!Array.from(v).some(v => v.match(/[a-zA-Z]/gi))
											? 'text-nowrap'
											: ''
									}
									key={v}
								>
									{v}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
