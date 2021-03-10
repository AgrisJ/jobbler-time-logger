import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const LandingPage = () => {
    return (
        <div class="page page-landing">
            <div class="intro">
                <h2>Welcome</h2>
                <p>Welcome to the Great outdoor homes</p>
                <Link to="/signin">Sign In</Link>
            </div>
        </div>
    );
}

export default LandingPage
