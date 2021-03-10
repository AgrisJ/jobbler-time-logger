/* eslint-disable react/jsx-key */
import React, { lazy } from 'react';
import AuthorizedRoute from 'base-shell/lib/components/AuthorizedRoute/AuthorizedRoute';
import UnauthorizedRoute from 'base-shell/lib/components/UnauthorizedRoute/UnauthorizedRoute';
import { Route } from 'react-router-dom';

const SignIn = lazy(() => import('../pages/SignIn/SignIn'))
const About = lazy(() => import('../pages/About/About'))
const Home = lazy(() => import('../pages/Home/Home'))

const routes = [
    <Route path={['/', '/home']} exact component={Home} />,
    //<AuthorizedRoute path={['/', '/home']} exact component={Home} />
    <Route path="/about" exact component={About} />,
    <UnauthorizedRoute path="/signin" exact component={SignIn} />
]

export default routes;