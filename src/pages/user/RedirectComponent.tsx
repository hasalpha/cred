import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import { getUrl } from '../../apis/auth.api';

function RedirectComponent() {
	const { UUID } = useParams();
	const { pathname } = useLocation();
	const navigate = useNavigate();

	const { isError, isSuccess, data } = useQuery({
		queryKey: ['suffix', UUID],
		queryFn: () => getUrl(UUID ?? ''),
		refetchOnWindowFocus: false,
		staleTime: Infinity,
	});

	if (isError) toast.error('Something went wrong while redirecting!');
	if (isSuccess) {
		const { suffix } = data;
		if (pathname.includes('password-reset')) {
			window.location.replace(suffix);
			return <></>;
		}
		navigate(suffix);
	}
	return <Loading />;
}

export default React.memo(RedirectComponent);
