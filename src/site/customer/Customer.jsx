import React, {Component} from "react";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import {DataTable} from "primereact/components/datatable/DataTable";
import {Column} from "primereact/components/column/Column";
import {InputText} from "primereact/components/inputtext/InputText";
import Card from "../../card/Card";
import PageHeader from "react-bootstrap";
import AjaxRequest from "robe-react-commons/lib/connections/AjaxRequest";

export default class Customer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            selam: "",
            filters: {}
        }
        this.onFilter = this.onFilter.bind(this);
    }

    onFilter(e) {
        this.setState({filters: e.filters});
    }

    render() {
        var header = <div style={{'textAlign': 'left'}}>
            <i className="fa fa-search" style={{margin: '4px 4px 0 0'}}></i>
            <InputText type="search" onInput={(e) => this.setState({globalFilter: e.target.value})}
                       placeholder="Global Search" size="50"/>
        </div>;
        return (
            <Card header="Müşteri Yönetimi">
                <div>
                    <div className="content-section implementation">
                        <DataTable value={this.state.customers}
                                   paginator={true} rows={10} header={header}
                                   globalFilter={this.state.globalFilter}
                                   filters={this.state.filters}
                                   onFilter={this.onFilter}
                        >
                            <Column field="name" header="İsim" filter={true}/>
                            <Column field="surname" header="Soyisim" filter={true}/>
                            <Column field="mobilePhone" header="Tel" filter={true}/>
                        </DataTable>
                    </div>
                </div>
            </Card>
        );
    }


    __getAllCustomer() {

        let request = new AjaxRequest({
            url: "customer",
            type: "GET"
        });

        request.call(undefined, undefined,
            (response) => {
                this.setState({customers: response});
            });
    }

    componentDidMount() {
        this.__getAllCustomer();
    }

}