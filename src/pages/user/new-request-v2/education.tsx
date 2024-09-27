import { SVGProps } from 'react';

const EducationSVG = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		width={70}
		height={70}
		viewBox='0 0 240 240'
		{...props}
	>
		<defs>
			<clipPath id='a'>
				<path d='M0 55.352h240v129H0Zm0 0' />
			</clipPath>
		</defs>
		<g clipPath='url(#a)'>
			<path
				fill='#a6a6a6'
				fillRule='evenodd'
				d='m55.7 123.816 64.3 22.438 64.3-22.438v38.852c0 12.137-28.788 21.977-64.3 21.977s-64.3-9.84-64.3-21.977ZM120 55.352l120 41.867-17.75 6.191v34.399l.504.152a7.425 7.425 0 0 1 2.36 12.082l-.122.098 4.149 24.308H210.59l4.148-24.308-.12-.098a7.385 7.385 0 0 1-2.169-5.246 7.427 7.427 0 0 1 4.528-6.836l.5-.152v-32.73L120 139.085 0 97.219Zm0 0'
			/>
		</g>
	</svg>
);
export default EducationSVG;
