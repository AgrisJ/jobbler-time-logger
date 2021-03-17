import styled from 'styled-components/macro';

export const FormWrapper = styled.div`
display: grid;
place-items: center;
margin-top: -2em;
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
padding: 60px 32px;
`

export const FormH1 = styled.h1`
margin-bottom: 15px;
color: #000;
font-size: 20px;
font-weight: 400;
text-align: center;
-webkit-user-select: none; /* Safari */
-ms-user-select: none; /* IE 10 and IE 11 */
user-select: none; /* Standard syntax */
`

export const FormLabel = styled.label`
margin-bottom: 8px;
font-size: 17px;
color: #878787;
text-align: center;
`
export const CautionContainer = styled.div`
border: 1px solid;
border-color: rgb(217, 122, 54);
display: flex;
flex-direction: column;
border-radius: 8px;
padding: 3em;
margin: 0.7em 0;
`

export const CautionText = styled.h2`
margin-bottom: 15px;
color: #d97a36;
font-size: 13px;
position: relative;
top: -10px;
margin-top: -2em;

-webkit-user-select: none; /* Safari */
-ms-user-select: none; /* IE 10 and IE 11 */
user-select: none; /* Standard syntax */
`

export const FormInput = styled.input`
padding: 16px 16px;
margin-bottom: 14px;
border-radius: 4px;
border: 1px solid;
border-color: ${({ hasErrors }) => (hasErrors ? '#ff3860' : '#ccc')};
box-shadow: ${({ hasErrors }) => (hasErrors ? '0 0 0 0.125em #ff386040' : '')};
`
export const FormButton = styled.button`
 background-color: #4c8faf; 
border: none;
color: white;
padding: 16px 0;
text-align: center;
text-decoration: none;
display: inline-block;
font-size: 16px;
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
