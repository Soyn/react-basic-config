import React, { Component } from 'react';
import { Breadcrumb, BreadcrumbItem } from 'react-bootstrap';

export class BootstrapBreadcrumb extends Component {
	render() {
		return (
			<Breadcrumb>
				<Breadcrumb.Item href="#">Home</Breadcrumb.Item>
				<Breadcrumb.Item href="https://getbootstrap.com/docs/4.0/components/breadcrumb/">
					Library
  		</Breadcrumb.Item>
				<Breadcrumb.Item active>Data</Breadcrumb.Item>
			</Breadcrumb>
		)
	}
}