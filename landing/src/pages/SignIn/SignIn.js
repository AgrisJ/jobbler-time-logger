import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { useAuth } from 'base-shell/lib/providers/Auth'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './SignIn.css';

const SignIn = () => {
    const { setAuth } = useAuth();
    let history = useHistory();
    const intl = useIntl();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [setPassword] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        authenticate({
            displayName: username,
        })
    }

    const authenticate = (user) => {
        setAuth({ isAuthenticated: true, ...user });
        let _location = history.location
        let _route = '/home'
        if (_location.state && _location.state.from) {
            _route = _location.state.from.pathname
            history.push(_route);
        } else {
            history.push(_route);
        }
    }

    return (
        <div class="page page-signin">
            <Form className="form-signin" onSubmit={handleSubmit}>
                <Form.Group controlId="formGroupEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder={intl.formatMessage({ id: 'email' })} onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="formGroupPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder={intl.formatMessage({ id: 'password' })} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Button variant="dark" type="submit">{intl.formatMessage({ id: 'sign_in' })}</Button>
            </Form>
        </div>
    )
}

export default SignIn
