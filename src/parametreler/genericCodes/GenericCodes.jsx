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

export default class GenericCodes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tipler: [],
            displayDialog: false, //tip ekleme popup
            displayDialogParametre: false, //parametre ekleme popup
            secilenTip: {}
        }
        ;

        this.__onFilter = this.__onFilter.bind(this);
        this.__yeniTipButon = this.__yeniTipButon.bind(this);
        this.__duzenleButton = this.__duzenleButton.bind(this);
        this.__kaydetTip = this.__kaydetTip.bind(this);
        this.__actionTemplate = this.__actionTemplate.bind(this);
        this.__kaydetParametre = this.__kaydetParametre.bind(this);

    }

    // Kayıt'ın aktif pasif durum kolonu
    __statusRow(column) {
        if (column.aktif)
            return <td><FaIcon code={"fa-check-square-o "}/></td>;
        else
            return <td><FaIcon code={"fa-square-o "}/></td>;
    }


    render() {
        let header =
            <div style={{'textAlign': 'left'}}>
                <i className="fa fa-search" style={{margin: '4px 4px 0 0'}}></i>
                <InputText type="search" onInput={(e) => this.setState({globalFilter: e.target.value})}
                           placeholder="Genel Arama" size="50"/>
                <Button icon="fa-plus" label="Yeni Tip" style={{float: 'right'}}
                        onClick={this.__yeniTipButon} className="ui-button-success"/>
            </div>;

        let dialogFooter =
            <div className="ui-dialog-buttonpane ui-helper-clearfix">
                <Button label="Kaydet" icon="fa-check" onClick={this.__kaydetTip}
                        className="ui-button-success"/>
                <Button icon="fa-close" label="İptal"
                        onClick={() => {
                            this.setState({displayDialog: false, loading: false});
                        }}
                />
            </div>;

        let dialogParametreFooter =
            <div className="ui-dialog-buttonpane ui-helper-clearfix">
                <Button label="Kaydet" icon="fa-check" onClick={this.__kaydetParametre}
                        className="ui-button-success"/>
                <Button icon="fa-close" label="İptal"
                        onClick={() => {
                            this.setState({displayDialogParametre: false, loading: false});
                        }}
                />
            </div>;
        return (
            <Card>
                <div>
                    <div className="content-section implementation">
                        {this.state.genelKodlar ? this.state.genelKodlar.length : 0} kayıt bulundu
                        <DataTable value={this.state.genelKodlar}
                                   paginator={true} rows={10} header={header}
                                   globalFilter={this.state.globalFilter}
                                   filters={this.state.filters}
                                   selectionMode="single"
                                   selection={this.state.secilenGenelKod}
                            // onSelectionChange={(e) => {
                            //     this.setState({selectedCustomer: e.data, policyAddButtonDisable: false});
                            // }}
                                   onSelectionChange={(e) => {
                                       this.__onSelectionChange(e.data)
                                   }}
                                   onFilter={this.__onFilter}
                        >
                            <Column field="label" header="İsim" filter={true}/>
                            <Column field="kod" header="Kodu" filter={true}/>
                            <Column field="tip.isim" header="Tipi" filter={true}/>
                            <Column field="aktif" header="Durum" body={this.__statusRow}
                                    style={{textAlign: 'center', width: '5em'}}/>
                            <Column header="İşlemler" body={this.__actionTemplate}
                                    style={{textAlign: 'center', width: '7em'}}>
                            </Column>
                        </DataTable>
                    </div>

                    {/*//kaydet ve güncelle button*/}
                    <div className="content-section implementation">

                        <Modal show={this.state.displayDialog}
                               onHide={() => {
                                   this.setState({displayDialog: false})
                               }}>
                            <Modal.Header>
                                <Modal.Title>{this.state.headerDialog}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {this.state.tip && <div className="ui-grid ui-grid-responsive ui-fluid">

                                    <div className="ui-grid-row">
                                        <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                            htmlFor="label">İsim</label></div>
                                        <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                            <InputText id="isim" onChange={(e) => {
                                                this.__updateProperty('type', 'isim', e.target.value)
                                            }} value={this.state.tip.isim}/>
                                        </div>
                                    </div>

                                    <div className="ui-grid-row">
                                        <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                            htmlFor="label">Kod</label></div>
                                        <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                            <InputText id="kod" onChange={(e) => {
                                                this.__updateProperty('type', 'kod', e.target.value)
                                            }} value={this.state.tip.kod}/>
                                        </div>
                                    </div>

                                    <div className="ui-grid-row">
                                        <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                            htmlFor="aktif">Durum</label></div>
                                        <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                            <InputSwitch id="aktif"
                                                         onLabel="Aktif" offLabel="Pasif"
                                                         checked={this.state.tip.aktif}
                                                         onChange={(e) => {
                                                             this.__updateProperty('type', 'aktif', e.value)
                                                         }}/>
                                        </div>
                                    </div>

                                </div>
                                }
                            </Modal.Body>
                            <Modal.Footer>
                                {dialogFooter}
                            </Modal.Footer>
                        </Modal>
                    </div>


                    {/*parametre ekle popup*/}
                    <div className="content-section implementation">
                        <Modal show={this.state.displayDialogParametre}
                               onHide={() => {
                                   this.setState({displayDialogParametre: false})
                               }}>
                            <Modal.Header>
                                <Modal.Title>{this.state.headerDialog}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {this.state.genelKodlar && <div className="ui-grid ui-grid-responsive ui-fluid">

                                    <div className="ui-grid-row">
                                        <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                            htmlFor="label">İsim</label></div>
                                        <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                            <InputText id="isim" onChange={(e) => {
                                                this.__updateProperty('genelKodlar', 'isim', e.target.value)
                                            }} value={this.state.genelKodlar.isim}/>
                                        </div>
                                    </div>

                                    <div className="ui-grid-row">
                                        <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                            htmlFor="label">Kod</label></div>
                                        <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                            <InputText id="kod" onChange={(e) => {
                                                this.__updateProperty('genelKodlar', 'kod', e.target.value)
                                            }} value={this.state.genelKodlar.kod}/>
                                        </div>
                                    </div>

                                    <div className="ui-grid-row">
                                        <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                            htmlFor="aktif">Durum</label></div>
                                        <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                            <InputSwitch id="aktif"
                                                         onLabel="Aktif" offLabel="Pasif"
                                                         checked={this.state.genelKodlar.aktif}
                                                         onChange={(e) => {
                                                             this.__updateProperty('genelKodlar', 'aktif', e.value)
                                                         }}/>
                                        </div>
                                    </div>

                                </div>
                                }
                            </Modal.Body>
                            <Modal.Footer>
                                {dialogParametreFooter}
                            </Modal.Footer>
                        </Modal>
                    </div>

                </div>
            </Card>
        )
    }

    __updateProperty(type, property, value) {
        switch (type) {
            case "type":
                let tip = this.state.tip;
                tip[property] = value;
                this.setState({tip: tip});
                break;
            case "genelKodlar":
                let genelKodlar = this.state.genelKodlar;
                genelKodlar[property] = value;
                this.setState({genelKodlar: genelKodlar});
                break;
        }

    }

    // Giridin üstünde ki yeni tip ekle Butonu
    __yeniTipButon() {
        this.yeniKayit = true;
        this.setState({
            tip: {
                isim: '',
                kod: '',
                aktif: true
            },
            displayDialog: true,
            headerDialog: "Yeni Tip Kaydet",
            loading: true
        });
    }

    // Giridin sonunda ki parametre ekle Butonu
    __parametreEkleButton(rowData, column) {
        let selected = column.rowData;
        this.setState({
            genelKodlar: {
                tip: selected,
                label: "",
                kod: "",
                anaKod: null,
                aktif: true
            },
            displayDialogParametre: true,
            headerDialog: "Parametre Ekle",
            loading: true
        });
    }

    __duzenleButton(rowData, column) {
        this.yeniKayit = false;
        let secilenTip = column.rowData;
        this.setState({
            displayDialog: true,
            tip: secilenTip,
            headerDialog: "Tip Güncelle"
        });
    }

    // Girdin sonunda ki işlemler colonu
    __actionTemplate(rowData, column) {
        return (
            <div className="ui-helper-clearfix" style={{width: '100%'}}>

                <Tooltip for="#parametreButton" title="Parametre Ekle" tooltipPosition="top"/>
                <Button id="parametreButton" icon="fa-plus" type="button" className="ui-button-success"
                        onClick={(rowData) => {
                            this.__parametreEkleButton(rowData, column)
                        }}/>

                <Tooltip for="#editButton" title="Güncelle" tooltipPosition="top"/>
                <Button id="editButton" type="button" icon="fa-edit" className="ui-button-warning"
                        onClick={(rowData) => {
                            this.__duzenleButton(rowData, column)
                        }}>
                </Button>
            </div>
        );
    }

    __onFilter(e) {
        this.setState({filters: e.filters});
    }

    __onSelectionChange(date) {
        this.setState({selectedCompanyPolicyType: date});
    }

    __kaydetTip() {
        let type = "";
        if (this.yeniKayit) {
            type = "POST";
        } else {
            type = "PUT";
        }
        this.request = new AjaxRequest({
            url: "type",
            type: type
        });
        this.request.call(this.state.tip, undefined, function (response) {
            if (response != null) {
                Toast.success("Kayıt Başarılı");
                this.setState({tip: null, displayDialog: false, loading: false});
            } else {
                Toast.error("Kayıt Başarısız")
            }
            this.__listeTipler();
            this.forceUpdate();
        }.bind(this));
    }

    __kaydetParametre() {

        let genelKodlar = this.state.genelKodlar;

        this.request = new AjaxRequest({
            url: "genel-kodlar",
            type: "POST"
        });
        this.request.call(genelKodlar, undefined, function (response) {
            if (response != null) {
                Toast.success("Kayıt Başarılı");
                this.setState({genelKodlar: null, displayDialogParametre: false, loading: false});
            } else {
                Toast.error("Kayıt Başarısız")
            }
            this.__listeTipler();
            this.forceUpdate();
        }.bind(this));
    }

    __listeTipler() {
        let request = new AjaxRequest({
            url: "parameters",
            type: "GET"
        });

        request.call(undefined, undefined, function (response) {
            if (response != null) {
                this.setState({genelKodlar: response});
            }
            this.forceUpdate();
        }.bind(this));
    }


    componentDidMount() {
        this.__listeTipler();
    }

}