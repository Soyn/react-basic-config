import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
export class BootstrapAlert extends Component {
    render() {
        const alertsGroup = ['primary', 'secondary', 'success',
            'danger', 'warning', 'info', 'light', 'dark'].map((variant, idx) => {
            return (<Alert key={idx} variant={variant} dismissible>
                This is a {variant} alert-check it out!
                    <Alert.Link>Example Link</Alert.Link>
                </Alert>);
            });
        return alertsGroup;
    }
}