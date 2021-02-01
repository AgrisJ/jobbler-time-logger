import styled from 'styled-components/macro';

export const LoginFormWrapper = styled.div`
display: grid;
place-items: center;
height: 100vh;
background: linear-gradient(15deg, #bcbcbc, transparent);
`

export const FormContent = styled.div`
display: flex;
justify-content: center;
flex-direction: column;
height: 100%;
width: 100%;
`
export const Form = styled.form`
display: grid;
/* background: #cecece; */
height:auto;
width:100%;
z-index:1;
margin: 0 auto;padding: 80px 32px;
/* border-radius: 4px;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.9); */
`

export const FormH1 = styled.h1`
margin-bottom: 40px;
color: #000;
font-size: 20px;
font-weight: 400;
text-align: center;
`
export const FormLabel = styled.label`
margin-bottom: 8px;
font-size: 14px;
color: #000;
`




export const FormInput = styled.input`
padding: 16px 16px;
margin-bottom: 32px;
border-radius: 4px;
border: 1px solid #ccc;
/* width: 100%;
padding: 12px 20px;
margin: 8px 0;
display: inline-block;

box-sizing: border-box; */
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

export const Text = styled.span`
text-align: center;
margin-top: 24px;
color: #000;
font-size: 14px;
`
