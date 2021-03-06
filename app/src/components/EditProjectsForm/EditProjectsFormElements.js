import styled from 'styled-components/macro';
import { globalConfig } from '../../config/global_config';
const themeVariables = globalConfig.CONFIG_themeVariables;
const { THEME_mainButton } = themeVariables;

export const FormWrapper = styled.div` //TODO erase all the unrelated stuff
display: grid;
place-items: center;
margin-top: -2em;
`

export const FormContent = styled.div`
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

export const FormInput = styled.input`
padding: 16px 16px;
margin-bottom: 14px;
border-radius: 4px;
border: 1px solid;
border-color: ${({ hasErrors }) => (hasErrors ? '#ff3860' : '#ccc')};
box-shadow: ${({ hasErrors }) => (hasErrors ? '0 0 0 0.125em #ff386040' : '')};
`
export const FormButton = styled.button`
 /* background-color: #4c8faf;  */
 background-color: ${THEME_mainButton};
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
