import React from "react";
import Card from "../../card/Card";
import ModalDataForm from "robe-react-ui/lib/form/ModalDataForm";
import DataGrid from "robe-react-ui/lib/datagrid/DataGrid";
import AjaxRequest from "robe-react-commons/lib/connections/AjaxRequest";
import Assertions from "robe-react-commons/lib/utils/Assertions";
import RemoteEndPoint from "robe-react-commons/lib/endpoint/RemoteEndPoint";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import Store from "robe-react-commons/lib/stores/Store";
import SHA256 from "crypto-js/sha256";
import UserModel from "./UserModel.json";
import FaIcon from "robe-react-ui/lib/faicon/FaIcon";
export default class User extends ShallowComponent {

    static idField = "id";
    roleRequest = new AjaxRequest({
        url:"roles",
        type:"GET"
    });
    constructor(props) {
        super(props);

        let store = new Store({
            endPoint: new RemoteEndPoint({
                url: "users"
            }),
            idField: User.idField,
            autoLoad: true
        });

        this.state = {
            fields: UserModel.fields,
            store: store,
            showModal: false,
            item: {},
            items:[],
            propsOfFields: {
                roleOid: {
                    items: []
                }
            }
        };
    }

    render() {
        return (
            <Card header="Kullanıcı Yönetimi">
                <DataGrid
                    fields={this.state.fields}
                    store={this.state.store}
                    propsOfFields={this.state.propsOfFields}
                    ref={"table"}
                    toolbar={[{name: "create", text: "Ekle"}, {name: "edit", text: "Düzenle"}, {
                        name: "delete",
                        text: "Sil"
                    }]}
                    cellRenderer={this.__cellRenderer}
                    onNewClick={this.__add}
                    onEditClick={this.__edit}
                    onDeleteClick={this.__remove}
                    pagination={{emptyText: "No data.", pageSize: 20}}
                    modalConfirm={{header: "Please do not delete me."}}
                    pageSizeButtons={["20", "50", "100"]}
                    refreshable={true}
                    pageable={true}
                    editable={true}

                />
                <ModalDataForm
                    ref="detailModal"
                    header="Kullanıcı Yönetimi"
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
        selectedRows[0].roleOid=this.__findRoleObject(selectedRows[0].role.id).id;
        this.__showModal(selectedRows[0]);
    }

    __onCancel() {
        this.setState({showModal: false});
    }

    __onSave(newData, callback) {
        let id = newData[User.idField];
        newData.role = this.__findRoleObject(newData.roleOid);
        newData.password = SHA256(newData.password).toString();
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

    __showModal(newItem: Object) {
        let selectedRows = this.refs.table.getSelectedRows();

            /*[{
        value : this.state.propsOfFields.roleOid.items[0].value,
        text : this.state.propsOfFields.roleOid.items[0].text
        }];*/
        this.setState({showModal: true, item: newItem});
    }

    componentDidMount() {

        this.roleRequest.call(undefined, undefined, (response) => {

            let state = {};
            state.items = response;
            state.propsOfFields = this.state.propsOfFields;
            for (let i = 0; i < response.length; i++) {
                let res = response[i];
                state.propsOfFields.roleOid.items.push({
                    value: res.id,
                    text: res.name
                });
            }
            this.setState(state);
            this.forceUpdate();
        });
    }
    __cellRenderer(idx: number, fields: Array, row: Object) {
        let password = "******";
        if(fields[idx].name =='username') {
            return <td key={fields[idx].name}>{row.username}</td>;
        }
        if (fields[idx].name == 'roleOid') {
            return <td key={fields[idx].name}>{row.role.name}</td>;
        }
        if(fields[idx].name =='name') {
            return <td key={fields[idx].name}>{row.name}</td>;
        }
        if (fields[idx].name == 'surname') {
            return <td key={fields[idx].name}>{row.surname}</td>;
        }
        if(fields[idx].name == 'password') {
            return <td key={fields[idx].name}>{password}</td>;
        }
        if(fields[idx].name == 'active') {
            if(row.active == true)
                return <td key={fields[idx].name}><FaIcon code={"fa-check-square-o "} /></td>;
            else
                return <td key={fields[idx].name}><FaIcon code={"fa-square-o "} /></td>;
        }

    }

    __findRoleObject(selectedOid: String){

        for(let i = 0; i < this.state.items.length; i++){
            let roleObject = this.state.items[i];
            if(roleObject && roleObject.id == selectedOid)
                return roleObject;
        }
        return undefined;
    }
}
