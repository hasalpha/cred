export function InstructionsButton() {
	return (
		<a
			className='btn brandPrimary--bg btn--sm'
			href='https://docs.google.com/document/d/1iWmJE9aNDaqA4vsz6XdeUhVu1RWJOowNpdAP95v3UrE/edit?usp=sharing'
			target='_blank'
			rel='noreferrer'
		>
			{' '}
			<i
				className='fa fa-book'
				style={{ marginRight: '5px' }}
			></i>{' '}
			Instructions<div className='ripple-container'></div>
		</a>
	);
}
