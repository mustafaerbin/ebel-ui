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

// rayic degeri
export default class FairValue extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listeRayicDegerleri: [],
            rayicDegeri: {},
            showGrid: false
        };

        this.__ara = this.__ara.bind(this);
    }

    render() {

        return (
            <Card>
                <BreadCrumb model={[
                    {label: 'Bilgi Edinme'},
                    {label: 'Rayiç Değerleri'}
                ]}/>
                <div>
                    <br/>
                    <div>

                        <Dropdown
                            value={this.state.rayicDegeri.mahalle}
                            options={this.state.listeMahalleler}
                            onChange={(e) => {
                                this.__handleChangeDropDown("mahalle", e)
                            }}
                            style={{width: 'ui-grid-col-8'}}
                            placeholder="Mahalle Seçiniz"
                            editable={true}
                            filter={true}
                            filterPlaceholder="Mahalle Ara"
                            filterBy="label,value"
                        />
                        {'   '}

                        <Dropdown
                            value={this.state.rayicDegeri.sokak}
                            options={this.state.listeSokaklar}
                            onChange={(e) => {
                                this.__handleChangeDropDown("sokak", e)
                            }}
                            style={{width: 'ui-grid-col-8'}}
                            placeholder="Sokak Seçiniz"
                            editable={true}
                            filter={true}
                            filterPlaceholder="Sokak Ara"
                            filterBy="label,value"
                        />
                        {'   '}
                        <Dropdown
                            value={this.state.rayicDegeri.yil}
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
                    <DataTable value={this.state.listeRayicDegerleri}
                               paginator={true} rows={10}
                               globalFilter={this.state.globalFilter}
                               selectionMode="single"
                               emptyMessage="Kayıt Bulunamadı"
                    >
                        <Column field="sokak.label" header="Bölge"/>
                        <Column field="deger" header="Rayiç Bedeli"/>
                    </DataTable>
                </div>
            );
        }
    }

    __ara() {

        if (this.state.rayicDegeri.yil === undefined || this.state.rayicDegeri.yil === null) {
            Toast.info("Yıl Seçmelisiniz");
        } else {
            let rayicDegeri = this.state.rayicDegeri;

            let request = new AjaxRequest({
                url: "fair-value/find-fair-value",
                type: "POST"
            });

            request.call(rayicDegeri, undefined,
                (response) => {
                    this.setState({listeRayicDegerleri: response, showGrid: true});
                });
        }
    }

    __handleChangeDropDown(property, e) {
        let value = e.value;
        let rayicDegeri = this.state.rayicDegeri;
        switch (property) {
            case "mahalle":
                const selected = this.state.listeMahalleler.find(o => o.value === value);
                rayicDegeri[property] = selected;
                this.__listeSokaklar(selected.value);
                break;
            case "sokak":
                const sokak = this.state.listeSokaklar.find(o => o.value === value);
                rayicDegeri[property] = sokak;
                break;
            case "yil":
                const yil = this.state.listeYillar.find(o => o.value === value);
                rayicDegeri[property] = yil.label;
                break;
        }
        this.setState({rayicDegeri: rayicDegeri});
    }

    __listeSokaklar(mahalleId) {
        let request = new AjaxRequest({
            url: "street/listeSokakMahalleId/" + mahalleId,
            type: "GET"
        });
        request.call(undefined, undefined,
            (response) => {
                this.setState({listeSokaklar: response});
            });
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

    __listeMahalleler() {

        let request = new AjaxRequest({
            url: "neighborhood",
            type: "GET"
        });

        request.call(undefined, undefined, function (response) {
            if (response != null) {
                this.setState({listeMahalleler: response});
            }
            this.forceUpdate();
        }.bind(this));

    }


    componentDidMount() {
        this.__listeMahalleler();
        this.__listeYillar();
    }

}