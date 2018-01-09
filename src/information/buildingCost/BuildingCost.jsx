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


export default class BuildingCost extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listeBinaMaliyetleri: [],
            genelKodlar: {
                // id: null,
                // yapiTür: null,
                // yapiFaliyet: null,
                // yil: null,
                // basit: null,
                // lüks: null,
                // birinciSinif: null,
                // ikinciSinif: null,
                // ucuncuSinif: null
            },
            binaMaliyeti: {},
            showGrid: false
        };

        this.__ara = this.__ara.bind(this);
        this.__temizle = this.__temizle.bind(this);
    }

    render() {

        return (
            <Card>
                <BreadCrumb model={[
                    {label: 'Bilgi Edinme'},
                    {label: 'Bina Maliyetleri'}
                ]}/>
                <div>
                    <br/>
                    <div>
                        <Dropdown
                            value={this.state.binaMaliyeti.yapiFaliyet}
                            options={this.state.listeYapiFaliyetleri}
                            onChange={(e) => {
                                this.__handleChangeDropDown("yapiFaliyet", e)
                            }}
                            style={{width: 'ui-grid-col-8'}}
                            placeholder="Yapı Faliyeti Seçiniz"
                            editable={true}
                            filter={true}
                            filterPlaceholder="Faliyet Ara"
                            filterBy="label,value"
                        />
                        {'   '}
                        <Dropdown
                            value={this.state.binaMaliyeti.yil}
                            options={this.state.listeYillar}
                            onChange={(e) => {
                                this.__handleChangeDropDown("yil", e)
                            }}
                            style={{width: 'ui-grid-col-8'}}
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
                    <DataTable value={this.state.listeBinaMaliyetleri}
                               paginator={true} rows={10}
                               globalFilter={this.state.globalFilter}
                               selectionMode="single"
                    >
                        <Column field="yapiTür.label" header="Yapı Türü"/>
                        <Column field="lüks" header="Lüks"/>
                        <Column field="birinciSinif" header="1.Sınıf"/>
                        <Column field="ikinciSinif" header="2.Sınıf"/>
                        <Column field="ucuncuSinif" header="3.Sınıf"/>
                        <Column field="basit" header="Basit"/>
                    </DataTable>
                </div>
            );
        }
    }

    __ara() {
        let binaMaliyeti = this.state.binaMaliyeti;

        let request = new AjaxRequest({
            url: "building-cost/find-building-cost",
            type: "POST"
        });

        request.call(binaMaliyeti, undefined,
            (response) => {
                this.setState({listeBinaMaliyetleri: response, showGrid: true});
            });
    }

    __handleChangeDropDown(property, e) {
        let value = e.value;
        let binaMaliyeti = this.state.binaMaliyeti;
        switch (property) {
            case "yapiFaliyet":
                const selected = this.state.listeYapiFaliyetleri.find(o => o.value === value);
                binaMaliyeti[property] = selected;
                break;
            case "yil":
                const yil = this.state.listeYillar.find(o => o.value === value);
                binaMaliyeti[property] = yil.label;
                break;
        }
        this.setState({binaMaliyeti: binaMaliyeti});
    }

    __listeBinaMaliyetleri() {

        let request = new AjaxRequest({
            url: "building-cost",
            type: "GET"
        });

        request.call(undefined, undefined, function (response) {
            if (response != null) {
                this.setState({listeBinaMaliyetleri: response});
            }
            this.forceUpdate();
        }.bind(this));
    }

    __listeYapiFaliyetleri() {

        let request = new AjaxRequest({
            url: "generic-codes/type-code/" + "YAPI_FALIYET",
            type: "GET"
        });

        request.call(undefined, undefined, function (response) {
            if (response != null) {
                this.setState({listeYapiFaliyetleri: response});
            }
            this.forceUpdate();
        }.bind(this));
    }

    __listeYillar() {

        let request = new AjaxRequest({
            url: "generic-codes/type-code/" + "YIL",
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
        this.__listeBinaMaliyetleri();
        this.__listeYapiFaliyetleri();
        this.__listeYillar();
    }

}