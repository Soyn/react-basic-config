import React, { Component } from 'react';
import { Badge } from 'react-bootstrap';

export class BootstrapBadge extends Component {
    render() {
        const variants = [
            "primary", 
            "secondary",
            "success",
            "danger",
            "warning",
            "info",
            "light",
            "dark"
        ];
        return (
            <div>
                {variants.map((variant, idx) => {
                    return (
                        <Badge pill variant={variant} key={`variant-${idx}`}>
                            {variant[0].toUpperCase() + variant.slice(1)}
                        </Badge>                    
                    );
                })}
            </div>
        )
    }
}