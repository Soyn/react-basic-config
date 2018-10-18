import React, { Component }from 'react'
import { Button, ButtonToolbar } from 'react-bootstrap';

export class BootStrapButton extends Component {
    render(){
        return(
            <ButtonToolbar>
                <Button variant="primary">Primary</Button>
                <Button variant="warning">Warning</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="info">Info</Button>
                <Button variant="light">Light</Button>
                <Button variant="dark">Dark</Button>
            </ButtonToolbar>
        )
    }
}