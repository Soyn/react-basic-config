import React, { Component } from 'react';
import { Card, Button } from 'react-bootstrap';

export class BootstrapCard extends Component {
    render() {
        const card = (<Card style={{ width: '18rem' }} bg="white">
                <Card.Img variant="top" src="./300px-Original_Doge_meme.jpg" />
                <Card.Body>
                    <Card.Title>Card Title</Card.Title>
                    <Card.Text>
                        Some quick example text to build on the card title and make up the bulk of
                        the card's content.
                    </Card.Text>
                    <Button variant="primary">Go somewhere</Button>
                </Card.Body>
            </Card>);
        return card;
    }
}