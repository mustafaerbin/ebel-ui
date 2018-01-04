import React from "react";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import {InputText} from 'primereact/components/inputtext/InputText';

export default class Todoo extends ShallowComponent {

    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };

    }


    render() {


        return (
            <div>
                <div className="content-section implementation">
                    <InputText onChange={(e) => this.setState({value: e.target.value})}/>
                    <span style={{marginLeft: '.5em'}}>{this.state.value}</span>
                </div>
            </div>
        )
    }


    componentDidMount() {
    }

}