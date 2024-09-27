import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	Fade,
	Modal,
	Stack,
	Typography,
} from '@mui/material';
import { ExpandMore, Save } from '@mui/icons-material';
import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { PreviewSliderQuestion, PreviewTextQuestion } from '.';
import {
	addCustomQuestion,
	getCustomQuestionsForThisUser,
} from '../apis/user.api';
import CustomRadioGroup from './CustomRadioGroup';
import CustomTextField from './CustomTextField';
import { CustomToolTip } from './CustomToolTip';
import { modalStyle } from './Questionnaires';

const useCustomQuestionHook = ({ value, setOpenModal, setInputValue }: any) => {
	const [text, setText] = React.useState(value);
	const [rateFlag, setRateFlag] = React.useState('0');
	const [loading, setLoading] = React.useState(false);

	React.useEffect(() => {
		setText(value);
	}, [setInputValue, value]);

	const handleChange = useCallback((event: any) => {
		setRateFlag(event.target.value);
	}, []);

	const handleClose = useCallback(() => setOpenModal(false), [setOpenModal]);
	return useMemo(
		() => ({
			text,
			setText,
			rateFlag,
			handleChange,
			handleClose,
			loading,
			setLoading,
		}),
		[handleChange, handleClose, loading, rateFlag, text]
	);
};

export default function AddQuestionModal({
	openModal,
	setOpenModal,
	value,
	updateSelectedQuestions,
	setInputValue,
	setOpen,
}: any) {
	const {
		text,
		setText,
		rateFlag,
		handleChange,
		handleClose,
		loading,
		setLoading,
	} = useCustomQuestionHook({ value, setOpenModal, setInputValue });
	async function handleCustomQuestionCreation() {
		try {
			if (text?.trim?.()?.length === 0) {
				toast.error('Question cannot be empty!');
				setText('');
				return;
			}
			if (loading) return;
			setLoading(true);
			const { question } = await addCustomQuestion({
				question: text.trim(),
				rateFlag: rateFlag,
			});
			const allQuestions = await getCustomQuestionsForThisUser().catch(
				() => {}
			);
			if (allQuestions) {
				const newlyAddedQuestion = allQuestions.find(
					(val: any) => val?.uuid === question
				);
				if (newlyAddedQuestion) (newlyAddedQuestion as any).isCustom = true;
				updateSelectedQuestions?.((prevQuestion: any) => [
					newlyAddedQuestion,
					...prevQuestion,
				]);
			}
			handleClose();
			setLoading(false);
			toast.success('Your question has been added successfully!');
			setOpen(false);
			setInputValue('');
		} catch (e: any) {
			toast.error(e.message);
			setLoading(false);
			setInputValue('');
			setOpen(false);
		}
	}
	return (
		<Modal
			aria-labelledby='custom-question-builder-modal'
			aria-describedby='custom-question-builder-modal'
			open={openModal}
			onClose={handleClose}
			closeAfterTransition
		>
			<Fade in={openModal}>
				<Box
					sx={{ ...modalStyle, pt: 2 }}
					className='modal-style h-fit overflow-y-auto'
				>
					<Typography
						align='center'
						className='text-primary'
						id='custom-question-builder-modal'
						variant='h5'
						gutterBottom={true}
						paragraph
						mt={0}
						mb={0}
					>
						Add a custom question
					</Typography>
					<Box sx={{ mb: 3 }}>
						<CustomRadioGroup
							value={rateFlag}
							handleChange={handleChange}
						/>
					</Box>
					<Accordion
						disableGutters
						sx={{ border: '1px solid #ed642b' }}
						defaultExpanded
					>
						<AccordionSummary
							expandIcon={<ExpandMore />}
							aria-controls='panel1a-content'
							id='panel1a-header'
						>
							<Typography
								className='text-secondary'
								component='div'
							>
								Preview{' '}
								<CustomToolTip
									className=''
									content={'Please add `?` to the custom question if needed'}
								/>{' '}
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<CustomTextField
								label={'Enter your question'}
								meta={{
									touched: true,
									error: 'Please enter a question!',
									invalid: text?.length <= 0,
								}}
								input={{ text, setText }}
							/>
							<Typography
								className='question'
								mt={1}
								mb={0}
							>
								{text}
							</Typography>
							{rateFlag === '1' ? (
								<PreviewSliderQuestion
									classNames={['inside-modal-preview-slider']}
								/>
							) : (
								<PreviewTextQuestion />
							)}
						</AccordionDetails>
					</Accordion>
					<Stack
						justifyContent='flex-end'
						alignItems='center'
						mt={1}
					>
						<Button
							variant='contained'
							startIcon={<Save />}
							onClick={handleCustomQuestionCreation}
						>
							Save
						</Button>
					</Stack>
				</Box>
			</Fade>
		</Modal>
	);
}
