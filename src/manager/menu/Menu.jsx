import React from "react";
import Card from "../../card/Card";
import ModalDataForm from "robe-react-ui/lib/form/ModalDataForm";
import DataGrid from "robe-react-ui/lib/datagrid/DataGrid";
import AjaxRequest from "robe-react-commons/lib/connections/AjaxRequest";
import Assertions from "robe-react-commons/lib/utils/Assertions";
import RemoteEndPoint from "robe-react-commons/lib/endpoint/RemoteEndPoint";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import Store from "robe-react-commons/lib/stores/Store";
import MenuModel from "./MenuModel.json";

export default class Menu extends ShallowComponent {

    static idField = "id";
    readRequest = new AjaxRequest({
        url: "menus/all",
        type: "GET"
    });
    constructor(props) {
        super(props);

        let store = new Store({
            endPoint: new RemoteEndPoint({
                url: "menus",
                read: {
                    url: "menus/all"
                }
            }),
            idField: Menu.idField,
            autoLoad: true
        });

        this.state = {
            fields: MenuModel.fields,
            store: store,
            showModal: false,
            item: {},
            propsOfFields: {
                parentOid: {
                    items: []
                }
            }
        };
    }

    render() {
        return (
            <Card header="Menü Yönetimi">
                <DataGrid
                    fields={this.state.fields}
                    store={this.state.store}
                    propsOfFields={this.state.propsOfFields}
                    ref={"table"}
                    toolbar={[{name: "create", text: "Ekle"}, {name: "edit", text: "Düzenle"}, {
                        name: "delete",
                        text: "Sil"
                    }]}
                    onNewClick={this.__add}
                    onEditClick={this.__edit}
                    onDeleteClick={this.__remove}
                    pagination={{emptyText: "No data.", pageSize: 20}}
                    modalConfirm={{header: "Please do not delete me."}}
                    pageSizeButtons={["20", "50", "100"]}
                    refreshable={true}
                    pageable={true}
                    editable={true}
                    cellRenderer={this.__cellRenderer}
                />
                <ModalDataForm
                    ref="detailModal"
                    header="Menü Yönetimi"
                    show={this.state.showModal}
                    propsOfFields={this.state.propsOfFields}
                    fields={this.state.fields}
                    onSubmit={this.__onSave}
                    onCancel={this.__onCancel}
                    defaultValues={this.state.item}
                />
            </Card>
        );
    }

    __add() {
        let empty = {};
        this.__showModal(empty);
    }

    __edit() {
        let selectedRows = this.refs.table.getSelectedRows();
        if (!selectedRows || !selectedRows[0]) {
            return;
        }
        if(selectedRows[0].parent != null){
            selectedRows[0].parentOid=selectedRows[0].parent.id;
        }
        this.__showModal(selectedRows[0]);
    }

    __onCancel() {
        this.setState({showModal: false});
    }

    __onSave(newData, callback) {
        let id = newData[Menu.idField];
        newData.parent = this.__findRoleObject(newData.parentOid);
        if (Assertions.isNotEmpty(id)) {
            this.state.store.update(newData);
        } else {
            this.state.store.create(newData);
        }
        if (newData) {
            callback(true);
            this.setState({
                showModal: true
            });
        }
        // this.refs[DataGridSample.tableRef].__readData();
    }

    __remove() {
        let selectedRows = this.refs.table.getSelectedRows();
        this.state.store.delete(selectedRows[0]);
    }

    __showModal(newItem) {
        this.setState({showModal: true, item: newItem});
    }

    __cellRenderer(idx: number, fields: Array, row: Object) {
        if(fields[idx].name =='text') {
            return <td key={fields[idx].name}>{row.text}</td>;
        }
        if (fields[idx].name == 'path') {
            return <td key={fields[idx].name}>{row.path}</td>;
        }
        if(fields[idx].name == 'parentOid') {
            if(row.parent == null)
                return <td key={fields[idx].name}>{""}</td>;
            else
                return <td key={fields[idx].name}>{row.parent.text}</td>;
        }
        if(fields[idx].name == 'module') {
            return <td key={fields[idx].name}>{row.module}</td>;
        }
        if(fields[idx].name == 'index'){
            return <td key={fields[idx].name}>{row.index}</td>;
        }
        if(fields[idx].name == 'icon') {
            return <td key={fields[idx].name}>{row.icon}</td>;
        }


    }

    componentDidMount() {

        this.readRequest.call(undefined, undefined, function (response) {
            let state = {};
            state.items = response;
            state.propsOfFields = this.state.propsOfFields;
            for (let i = 0; i < response.length; i++) {
                let res = response[i];
                state.propsOfFields.parentOid.items.push({
                    value: res.id,
                    text: res.text
                });
            }
            this.setState(state);
            this.forceUpdate();
        }.bind(this));

    };
    __findRoleObject(selectedOid: String){
        for(let i = 0; i < this.state.items.length; i++){
            let roleObject = this.state.items[i];
            if(roleObject && roleObject.id == selectedOid)
                return roleObject;
        }
        return undefined;
    }
}
