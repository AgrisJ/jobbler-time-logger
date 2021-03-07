import React, { Component } from 'react';
import App from 'base-shell/lib';
import config from './config';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

export default class Demo extends Component {
    render() {
        return <App config={config} />
    }
}
