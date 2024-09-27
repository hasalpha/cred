import React, { useState } from 'react';

interface IDeleteQuestionModalProps {
	handleDeletePreference?: (preference: boolean) => void;
	deleteUUID?: () => void;
	handleRemoveUUID?: () => void;
}

const DeleteQuestionModal = ({
	handleDeletePreference,
	deleteUUID,
	handleRemoveUUID,
}: IDeleteQuestionModalProps) => {
	const [isChecked, setIsChecked] = useState<boolean>();
	const [, setOpen] = useState<boolean>(true);
	return (
		<>
			<div
				className='modal fade'
				id='delete_question'
				tabIndex={-1}
				role='dialog'
				aria-labelledby='exampleModalLabel'
				aria-hidden='true'
			>
				<div
					className='modal-dialog top-1/4'
					role='document'
				>
					<div className='modal-content'>
						<div className='modal-body text-center'>
							<div className='row'>
								<div className='col'>
									<h3 className='text-primary'>
										Are you sure you want to delete that question?
									</h3>
									<div className='box-pad'>
										<div>
											<input
												className='relative top-1'
												type='checkbox'
												checked={isChecked == null ? false : isChecked}
												onChange={e => setIsChecked(e.target.checked)}
											/>
											<label className='mb-2'>&nbsp; Don’t ask me again</label>
										</div>
										<a
											href='#few'
											data-dismiss='modal'
											className='btn btn-secondary-outline'
											onClick={() => {
												setIsChecked(undefined);
												handleRemoveUUID?.();
												setOpen(false);
											}}
										>
											Cancel{' '}
										</a>
										&nbsp;
										<a
											href='credibled_signin.html'
											data-dismiss='modal'
											className='btn btn-primary'
											onClick={() => {
												deleteUUID?.();
												isChecked != null &&
													handleDeletePreference?.(!isChecked);
												setOpen(false);
											}}
										>
											Yes i’m sure
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default DeleteQuestionModal;
