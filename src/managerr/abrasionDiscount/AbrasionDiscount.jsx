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

// aşınma payı indirim oranı
export default class AbrasionDiscount extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listeAsinmaPayiIndirimOranlari: [],
            asinmaPayiIndirimOrani: {},
            showGrid: false
        };

        this.__ara = this.__ara.bind(this);
    }

    render() {

        return (
            <Card>
                <BreadCrumb model={[
                    {label: 'Bilgi Edinme'},
                    {label: 'Aşınma Payı İndirim Oranları'}
                ]}/>
                <div>
                    <br/>
                    <div>
                        <Dropdown
                            value={this.state.asinmaPayiIndirimOrani.yapiTur}
                            options={this.state.listeYapiTurleri}
                            onChange={(e) => {
                                this.__handleChangeDropDown("yapiTur", e)
                            }}
                            style={{width: 'ui-grid-col-8'}}
                            placeholder="Yapı Türü Seçiniz"
                            editable={true}
                            filter={true}
                            filterPlaceholder="Yapı Tür Ara"
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
                    <DataTable value={this.state.indirimOranlari}
                               paginator={true} rows={10}
                               globalFilter={this.state.globalFilter}
                               selectionMode="single"
                               emptyMessage="Kayıt Bulunamadı"
                    >
                        <Column field="yasAraligi" header="Yaş Aralığı"/>
                        <Column field="indirimOrani" header="İndirim Oranı"/>
                    </DataTable>
                </div>
            );
        }
    }

    __ara() {
        let asinmaPayiIndirimOrani = this.state.asinmaPayiIndirimOrani;

        let request = new AjaxRequest({
            url: "abrasion-discount/" + asinmaPayiIndirimOrani.yapiTur.value,
            type: "GET"
        });

        request.call(asinmaPayiIndirimOrani, undefined,
            (response) => {
                this.setState({listeAsinmaPayiIndirimOranlari: response, showGrid: true});
            });
    }

    __handleChangeDropDown(property, e) {
        let value = e.value;
        let asinmaPayiIndirimOrani = this.state.asinmaPayiIndirimOrani;
        switch (property) {
            case "yapiTur":
                const selected = this.state.listeYapiTurleri.find(o => o.value === value);
                asinmaPayiIndirimOrani[property] = selected;
                break;
        }
        this.setState({asinmaPayiIndirimOrani: asinmaPayiIndirimOrani});
    }

    __listeYapiTuru() {

        let request = new AjaxRequest({
            url: "parameters/type-code/" + Enums.TIP.YAPI_TUR,
            type: "GET"
        });

        request.call(undefined, undefined, function (response) {
            if (response != null) {
                this.setState({listeYapiTurleri: response});
            }
            this.forceUpdate();
        }.bind(this));

    }


    componentDidMount() {
        this.__listeYapiTuru();
    }

}