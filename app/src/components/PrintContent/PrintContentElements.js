import styled from 'styled-components/macro';

export const PrintContentContainer = styled.div`
	  background: #fff;
    display: flex;
    /* height: 800px; */
    z-index: 1;
    flex-direction: column;
		align-items: center;
		/* padding: 1.5em 0; */
		margin: 1em;
	`
export const A4ratio = styled.div`
    min-width: 30%;
	`
export const Header = styled.header`
	display: none;

	@media print {
	display: block;
	position: absolute;
	top: 0;
	width: 80%;
	height: .8in;
	position: fixed;
	}
`
export const Footer = styled.footer`
display: none;

	@media print {
	display: block;
	/* width: 80%; */
	height: .5in;
	position: fixed;
	bottom: 0;

	  width: 82%;
    background: white;
    margin-top: 0.1em;
    padding-top: 0.7em;
	}
`
export const HeadHeight = styled.div`
	/* height: .2in; */

	@media print {
		height: 1.1in;
	}
`
export const FootHeight = styled.div`
	height: .5in;

	@media print {
		height: .5in;
	}
`


export const PrintBody = styled.div`
	
	@media print {
	margin-top: 1.5in;
	}
`
export const PrintLogo = styled.img`
	width: 90px;
	margin-bottom: 0.8em;
`

export const PeriodHeading = styled.div`
	display:flex;
	justify-content:space-between;
	width: 100%;
	margin-bottom: 2em;

 @media print {
	width: 102%;
	background: white;
  padding-bottom: 1.85em;	
	}

	
`
export const Period = styled.h3.attrs(props => ({
	className: props.className
}))`

 @media print {
				&.printSize {
					font-size: 16px;
				}
		}

	font-family: 'Arial';
	font-size: 11px;
	font-weight: normal;
`
export const Heading = styled.h1.attrs(props => ({
	className: props.className
}))`

 @media print {
				&.printSize {
					font-size: 1.3em;
				}
			}
	font-family: 'Arial';
	font-size: 1em;
	font-weight: normal;
	margin-bottom: 0.5em;
	text-align: center;
`

export const PrintButton = styled.button`
	position:absolute;
	top: 1em;
	left:0;
	transform: translate(calc(50vw - 50%));
	padding: 1em 2em;

	background-color: #4CAF50;
  border: none;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
	border-radius: 4px;
`

export const TableWrapper = styled.table.attrs(props => ({
	className: props.className
}))`


 @media print {
				&.printSize {
					/* font-size: 1em; */
				}
				&.breakThis {
					page-break-inside: avoid;
					page-break-after: always;
				}
				page-break-after:auto;
			}
			
		width: 100%;
		/* width: 40%; */
		border: solid 1px black;
		border-collapse: collapse;
		/* font-size: 0.7em; */
	
`

export const TableCell = styled.td.attrs(props => ({
	className: props.className
}))`
		&.verticalTop {
					vertical-align: top;
		}
		&.alignCenter {
					text-align: center;
		}
		&.thirty { 
					width: 25%;
		}
		&.ten {
					width: 10%; // TODO doesn't apply on printmode and looks bad with names like: Andis Zos 140788-4767
		}
		&.hourLen {
					width: 40px;
		}
		/* &.dateColumn {width: 200px;} */
	

		 @media print {
				}

		border: solid 1px black;
		padding: 0.5em;
`

export const TableRow = styled.tr.attrs(props => ({
	className: props.className
}))`
@media print {
	&.breakThis { 
		page-break-inside: avoid; 
		page-break-after:always;	
	}
}

@media print {
	/* font-size: 1.05em; */
	font-size: 0.8em;
}
font-size: 0.8em;

&.bold {
		font-weight: bold;
}
`