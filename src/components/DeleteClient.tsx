import React from 'react';
import Loading from './Loading';
import { useDeleteClient } from '../Common';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function DeleteClient() {
	const navigate = useNavigate();
	const { isSuccess, isError } = useDeleteClient();
	if (isSuccess) {
		toast.success('Deleted successfully!');
		navigate('/super-admin/clients', { replace: true });
	}
	if (isError) {
		toast.error('Unable to delete client!');
		navigate('/super-admin/clients', { replace: true });
	}
	return <Loading />;
}
