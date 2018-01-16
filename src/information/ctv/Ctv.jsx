import React, {Component} from "react";
import {Application, ShallowComponent} from "robe-react-commons";
import {DataTable} from "primereact/components/datatable/DataTable";
import {Column} from "primereact/components/column/Column";
import {InputText} from "primereact/components/inputtext/InputText";
import Card from "../../card/Card";
import AjaxRequest from "robe-react-commons/lib/connections/AjaxRequest";
import {Button} from 'primereact/components/button/Button';
import {Modal} from "react-bootstrap";
import FaIcon from "robe-react-ui/lib/faicon/FaIcon";
import {Dropdown} from 'primereact/components/dropdown/Dropdown';
import Toast from "robe-react-ui/lib/toast/Toast";
import {Tooltip} from 'primereact/components/tooltip/Tooltip';
import {InputSwitch} from 'primereact/components/inputswitch/InputSwitch';
import {BreadCrumb} from 'primereact/components/breadcrumb/BreadCrumb';
import Enums from "../../entity/Enums";

// Ctv tarifesi
export default class Ctv extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listeCtvTarifesi: [],
            ctvTarifesi: {},
            showGrid: false
        };

        this.__ara = this.__ara.bind(this);
    }

    render() {

        return (
            <Card>
                <BreadCrumb model={[
                    {label: 'Bilgi Edinme'},
                    {label: 'ÇTV Tarifesi'}
                ]}/>
                <div>
                    <br/>
                    <div>
                        <Dropdown
                            value={this.state.ctvTarifesi.yil}
                            options={this.state.listeYillar}
                            onChange={(e) => {
                                this.__handleChangeDropDown("yil", e)
                            }}
                            style={{width: 'ui-grid-col-8'}}
                            // style={{width: '14em'}}
                            placeholder="Yıl Seçiniz"
                            editable={true}
                            filter={true}
                            filterPlaceholder="Yıl Ara"
                            filterBy="label,value"
                        />
                        {'   '}
                        <Button icon="fa-search" label="Ara"
                                onClick={this.__ara} className="ui-button-primary"/>
                    </div>

                    <br/>
                    {
                        this.__grid()
                    }
                </div>
            </Card>
        )
    }

    __grid() {

        if (this.state.showGrid) {
            return (
                <div className="content-section implementation">
                    <DataTable value={this.state.listeCtvTarifesi}
                               paginator={true} rows={10}
                               globalFilter={this.state.globalFilter}
                               selectionMode="single"
                    >
                        <Column field="yasAraligi" header="Yaş Aralığı"/>
                        <Column field="indirimOrani" header="İndirim Oranı"/>
                    </DataTable>
                </div>
            );
        }
    }

    __ara() {
        let ctvTarifesi = this.state.ctvTarifesi;

        let request = new AjaxRequest({
            url: "ctv/" + ctvTarifesi.yil,
            type: "GET"
        });

        request.call(undefined, undefined,
            (response) => {
                this.setState({listeCtvTarifesi: response, showGrid: true});
            });
    }

    __handleChangeDropDown(property, e) {
        let value = e.value;
        let ctvTarifesi = this.state.ctvTarifesi;
        switch (property) {
            case "yil":
                const yil = this.state.listeYillar.find(o => o.value === value);
                ctvTarifesi[property] = yil.label;
                break;
        }
        this.setState({ctvTarifesi: ctvTarifesi});
    }

    __listeYillar() {

        let request = new AjaxRequest({
            url: "parameters/type-code/" + Enums.TIP.YIL,
            type: "GET"
        });

        request.call(undefined, undefined, function (response) {
            if (response != null) {
                this.setState({listeYillar: response});
            }
            this.forceUpdate();
        }.bind(this));
    }


    componentDidMount() {
        this.__listeYillar();
    }

}