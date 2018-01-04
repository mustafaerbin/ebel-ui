import React from "react";
import DataGrid from "robe-react-ui/lib/datagrid/DataGrid";
import {ShallowComponent,Store,RemoteEndPoint} from "robe-react-commons";
import OperationLogModel from "./OperationLogModel.json";
import Card from "../../card/Card";

export default class OperationLog extends ShallowComponent {
    static idField = "id";
    constructor(props){
        super(props);
        let storeLog = new Store({
            endPoint: new RemoteEndPoint({
                url : "logs",
                idField : OperationLog.idField
            }),
            idField : OperationLog.idField
        });
        this.state = {
            store : storeLog,
            fields : OperationLogModel.fields
        }
    }
    render(){
        return(
            <Card header="Loglar">
                <DataGrid
                    fields={this.state.fields}
                    store={this.state.store}
                    propsOfFields={this.state.propsOfFields}
                    ref={"table"}
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

            </Card>);
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
            selectedRows[0].parentOid=selectedRows[0].parent.oid;
        }
        this.__showModal(selectedRows[0]);
    }
    __remove() {
        let selectedRows = this.refs.table.getSelectedRows();
        this.state.store.delete(selectedRows[0]);
    }
    //noinspection JSAnnotator
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
}