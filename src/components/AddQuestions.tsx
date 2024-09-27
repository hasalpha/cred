import { Autocomplete, createFilterOptions, TextField } from '@mui/material';
import { useAllQuestions } from '../Common';
import AddQuestionModal from './AddQuestionModal';
import { memo, useMemo, useState } from 'react';

const filter = createFilterOptions();

function AddQuestionsComponent({
	selectedQuestions = [],
	updateSelectedQuestions,
}: any) {
	const { data: questions } = useAllQuestions();
	const filteredQuestions = useMemo(
		() =>
			questions?.filter(
				(val: any) =>
					!selectedQuestions?.find((val2: any) => val2.uuid === val.uuid)
			),
		[questions, selectedQuestions]
	);
	const [open, setOpen] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const handleOpen = (
		e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) => (e.target.value.length > 0 ? setOpen(true) : setOpen(false));
	const handleClose = () => setOpen(false);
	return (
		<>
			<Autocomplete
				sx={{ mb: 2 }}
				onClose={handleClose}
				open={open}
				onChange={(_, newValue: any) => {
					if (newValue && newValue.inputValue) {
						// Create a new value from the user input
						setOpenModal(true);
						setOpen(false);
					} else if (newValue) {
						setInputValue('');
						updateSelectedQuestions?.((prevQuestion: any) => [
							newValue,
							...prevQuestion,
						]);
					}
				}}
				filterOptions={(options, params) => {
					const filtered = filter(options, params);

					const { inputValue } = params;
					// Suggest the creation of a new value
					const isExisting = options.some(
						option => inputValue === option.question
					);
					if (inputValue !== '' && !isExisting) {
						filtered.push({
							inputValue,
							question: `Add "${inputValue}"`,
						});
					}

					return filtered;
				}}
				selectOnFocus
				openOnFocus
				blurOnSelect
				clearOnBlur
				handleHomeEndKeys
				id='free-solo-with-text-demo'
				options={filteredQuestions ?? []}
				getOptionLabel={option => {
					// Value selected with enter, right from the input
					if (typeof option === 'string') {
						return option;
					}
					// Add "xxx" option created dynamically
					if (option.inputValue) {
						return option.inputValue;
					}
					// Regular option
					return option.question;
				}}
				renderOption={(props, option) => (
					<li
						{...props}
						key={option.uuid}
					>
						{option.question}
					</li>
				)}
				renderInput={params => (
					<TextField
						{...params}
						label='Search or Create a question'
						onKeyDown={e => e.key === 'Enter' && setOpenModal(true)}
						onClick={() => setOpen(true)}
						onChange={e => {
							handleOpen(e);
							setInputValue(e.target.value);
						}}
						sx={{
							'& label.Mui-focused': {
								color: '#ed642b',
							},
							'& .MuiOutlinedInput-root': {
								'&:hover fieldset': {
									borderColor: 'orange',
								},
								'&.Mui-focused fieldset': {
									borderColor: '#ed642b',
								},
							},
						}}
						value={inputValue}
					/>
				)}
				inputValue={inputValue}
			/>
			<AddQuestionModal
				{...{
					openModal,
					setOpenModal,
					setOpen,
					setInputValue,
					value: inputValue,
					updateSelectedQuestions,
				}}
			/>
		</>
	);
}

const AddQuestions = memo(AddQuestionsComponent);
export default AddQuestions;
