import React from "react";
import {ShallowComponent} from "robe-react-commons";
import {Col} from "react-bootstrap";

export default class Showcase extends ShallowComponent {
    render(){
        return(
            <Col md={12}>
                <iframe name="I1" width="100%" height="100%" src="https://www.primefaces.org/primereact/#/"></iframe>
            </Col>
        );
    }
}