import React from "react";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import DataTable from "primereact/components/datatable/DataTable";
import Column from "primereact/components/column/Column";
import Card from "../card/Card";
import PageHeader from "react-bootstrap";
import AjaxRequest from "robe-react-commons/lib/connections/AjaxRequest";
import InputText from "primereact/components/inputtext/InputText";

export default class Customer extends ShallowComponent {

    constructor(props) {
        super(props);
        this.state = {
            customers: []
        };


    }


    render() {

        var header = <div style={{'textAlign': 'left'}}>
            <i className="fa fa-search" style={{margin: '4px 4px 0 0'}}></i>
            <InputText type="search" onInput={(e) => this.setState({globalFilter: e.target.value})}
                       placeholder="Global Search" size="50"/>
        </div>;

        return (
            <div>
                <Card>
                    <PageHeader>
                        <small>Müşteri İşlemleri</small>
                    </PageHeader>

                    <div className="content-section implementation">
                        <DataTable
                            value={this.state.customers} paginator={true} rows={10} header={header}
                            globalFilter={this.state.globalFilter}
                        >
                            <Column field="name" header="İsim" filter={true}/>
                            <Column field="surname" header="Soyisim" filter={true}/>
                            <Column field="mobilePhone" header="Telefon" filter={true}/>

                        </DataTable>
                    </div>
                </Card>
            </div>
        )
    }

    __getAllCustomer() {

        this.request = new AjaxRequest({
            url: "customer",
            type: "GET"
        });

        this.request.call(undefined, undefined, function (response) {
            this.setState({
                customers: response
            });
            this.forceUpdate();
        }.bind(this));
    }

    componentWillMount() {
        this.__getAllCustomer();
    }

}