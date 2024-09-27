import Button from '@mui/material/Button/Button';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function GoBackLink({
	route,
	relative = true,
	previousTab,
}: {
	route?: string;
	relative?: boolean;
	previousTab?: string;
}) {
	const navigate = useNavigate();
	return (
		<Button
			variant='text'
			onClick={() => {
				if (route) return navigate(route);
				if (!!previousTab)
					return navigate('/home/requests', { state: previousTab });
				return relative
					? navigate('../', { relative: 'path', replace: true })
					: navigate(-1);
			}}
		>
			<ChevronLeftIcon />
			Back
		</Button>
	);
}
