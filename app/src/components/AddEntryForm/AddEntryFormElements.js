import styled from 'styled-components/macro';

export const FormWrapper = styled.div`
display: grid;
place-items: center;
`

export const FormContent = styled.div`
/* display: flex;
justify-content: center;
flex-direction: column; */
width: 50%;
	@media screen and (max-width: 650px) {
	width: 100%;
	}
`
export const Form = styled.form`
display: grid;
height:auto;
width:100%;
z-index:1;
margin: 0 auto;
padding: 32px 32px;
`

export const FormH1 = styled.h1`
margin-bottom: 15px;
color: #000;
font-size: 20px;
font-weight: 400;
text-align: center;
`
export const FormLabel = styled.label`
margin-bottom: 0px;
font-size: 18px;
color: #000;
text-align: center;
font-family: 'Expletus Sans';
`
export const DisplayLabel = styled.p`
margin-bottom: 0px;
font-size: 18px;
color: #000;
text-align: center;
font-family: 'Expletus Sans';
`


export const FormInput = styled.input`
width: 60%;
justify-self: center;
padding: 8px 8px;
margin-bottom: 14px;
background: #f2f2f2;
color: #828282;
text-align: center;
font-size: 26px;
font-family: 'Expletus Sans';
border-radius: 4px;
border: ${({ hasErrors }) => (hasErrors ? '1px solid #ff3860' : 'none')};
box-shadow: ${({ hasErrors }) => (hasErrors ? '0 0 0 0.125em #ff386040' : '')};
`
export const TotalHoursDisplay = styled.div`
width: 60%;
justify-self: center;
text-align: center;
padding: 16px 16px;
margin-bottom: 14px;
border-radius: 4px;
background: #f2f2f2;
color: #828282;
font-size: 26px;
font-family: 'Expletus Sans';
`
export const FormButton = styled.button`
background-color: #4c8faf;
width: 76%;
justify-self: center;
border: none;
color: white;
padding: 21px 16px;
text-align: center;
-webkit-text-decoration: none;
text-decoration: none;
font-size: 25px;
font-family: 'Roboto Light';
margin: 4px 2px;
cursor: pointer;
`

export const ErrorMessage = styled.div`
display: block;
font-size: .75rem;
margin-top: -0.75rem;
margin-bottom: 0.55rem;
color: #ff3860;
`
export const ScrollAnchor = styled.div.attrs(props => ({
	className: props.className
}))`

`
