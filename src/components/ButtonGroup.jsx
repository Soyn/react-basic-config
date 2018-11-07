import React, { Component } from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';

export class BootstrapButtonGroup extends Component {
    render() {
        const buttonGroup = (
        <ButtonGroup vertical toggle aria-label="Basic example">
            <Button variant="secondary">Left</Button>
            <Button variant="secondary">Middle</Button>
            <Button variant="secondary">Right</Button>
        </ButtonGroup>);

        return buttonGroup;
    }
}