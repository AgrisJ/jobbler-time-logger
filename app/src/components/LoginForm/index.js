import React from 'react'
import { FormInput, LoginFormWrapper, FormButton, FormContent, Form, FormH1, FormLabel, Text } from './LoginFormElements';

const LoginForm = () => {
	return (
		<LoginFormWrapper>
			<FormContent >
				<Form action="#">
					<FormH1>Sign in to your account</FormH1>
					<FormLabel htmlFor='for'>Email</FormLabel>
					<FormInput type='email' required />
					<FormLabel htmlFor='for'>Password</FormLabel>
					<FormInput type='password' required />
					<FormButton>Login</FormButton>
					<Text>Enjoy!</Text>
				</Form>
			</FormContent>
		</LoginFormWrapper>
	)
}

export default LoginForm
