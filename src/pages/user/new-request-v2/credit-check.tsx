import { SVGProps } from 'react';
const CreditCheckSVG = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		width={70}
		height={70}
		viewBox='0 0 240 240'
		{...props}
	>
		<defs>
			<clipPath id='a'>
				<path d='M0 36.602h240v166.5H0Zm0 0' />
			</clipPath>
		</defs>
		<g clipPath='url(#a)'>
			<path
				fill='#a6a6a6'
				d='M26.18 36.602C11.844 36.602.117 48.328.117 62.66v114.672c0 14.332 11.727 26.063 26.063 26.063h187.64c14.336 0 26.063-11.73 26.063-26.063V62.66c0-14.332-11.727-26.058-26.063-26.058Zm0 10.421h187.64a15.564 15.564 0 0 1 15.637 15.637v10.426H10.543V62.66A15.564 15.564 0 0 1 26.18 47.023ZM10.543 99.148h218.914v78.184a15.561 15.561 0 0 1-15.637 15.637H26.18a15.561 15.561 0 0 1-15.637-15.637Zm26.059 15.637v10.422H120v-10.422Zm0 0'
			/>
		</g>
	</svg>
);
export default CreditCheckSVG;
