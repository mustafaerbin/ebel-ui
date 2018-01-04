import React from "react";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import {ButtonToolbar, Col, Row, Tab, Tabs} from "react-bootstrap";
import AjaxRequest from "robe-react-commons/lib/connections/AjaxRequest";
import CheckTree from "robe-react-ui/lib/checktree/CheckTree";
import RadioInput from "robe-react-ui/lib/inputs/RadioInput";
import Button from "robe-react-ui/lib/buttons/Button";
import Toast from "robe-react-ui/lib/toast/Toast";
import Card from "../../card/Card";
import "./style.css";

export default class Permission extends ShallowComponent {

    static idField = "id";

    constructor(props) {
        super(props);

        this.state = {
            roleId: undefined,
            roleData: [],
            permissionServices: [],
            permissionServiceData: [],
            permissionMenus: [],
            permissionMenuData: [],
            activeTab: "service"
        };
    }


    render() {
        let saveFunc = this.state.activeTab === "service" ? this.__saveServices : this.__saveMenus;
        return (
            <Card header="İzin Yönetimi">
                <Row>
                    <Col sm={4}>
                        <RadioInput
                            label="Roller"
                            name="roleId"
                            items={this.state.roleData}
                            value={this.state.roleId}
                            textField="name"
                            valueField={Permission.idField}
                            formControl={false}
                            onChange={this.__handleChangeRole}/>
                    </Col>
                    <Col sm={8}>
                        <Tabs activeKey={this.state.activeTab}
                              onSelect={(key) => {
                                  this.setState({activeTab: key})
                              }}>
                            <Tab eventKey="service" title="Servis İzinleri">
                                <div className="tree-list">
                                    <CheckTree
                                        name="permissionServices"
                                        ref="permissionServices"
                                        items={this.state.permissionServiceData}
                                        value={this.state.permissionServices}/>
                                </div>
                            </Tab>
                            <Tab eventKey="menu" title="Menü İzinleri">
                                <div className="tree-list">
                                    <CheckTree
                                        name="permissionMenus"
                                        ref="permissionMenus"
                                        items={this.state.permissionMenuData}
                                        value={this.state.permissionMenus}/>
                                </div>
                            </Tab>
                        </Tabs>
                        <br/>
                        <ButtonToolbar className="pull-right">
                            <Button
                                disabled={this.state.roleId === undefined}
                                onClick={this.__resetPermission}
                                bsStyle="primary">Temizle</Button>
                            <Button
                                disabled={this.state.roleId === undefined}
                                onClickAsync={saveFunc}
                                bsStyle="info">Kaydet</Button>
                        </ButtonToolbar>
                        <br/>
                        <br/>
                    </Col>
                </Row>
            </Card>)
    }

    __handleChangeRole(e) {
        let state = {};
        let value = e.target.parsedValue !== undefined ? e.target.parsedValue : e.target.value;
        state[e.target.name] = value;
        this.setState(state);
        this.__readPermissionMenuByRole(value);
        this.__readPermissionServiceByRole(value);
    }

    __saveServices(e, done) {
        if (!this.state.roleId) return;

        this.request = new AjaxRequest({
            url: "permissions/configurePermission/" + this.state.roleId,
            type: "POST"
        });
        let data = this.refs.permissionServices.getSelectedItems();
        this.request.call(data, undefined,
            () => {
                done();
                Toast.success("Servis izinleri kaydedildi");
            },
            () => {
                done();
                Toast.error("Kayıt yapılamadı.");
            });

    }

    __saveMenus(e, done) {
        if (!this.state.roleId) return;

        this.request = new AjaxRequest({
            url: "permissions/configuresMenu/" + this.state.roleId,
            type: "POST"
        });

        let data = this.refs.permissionMenus.getSelectedItems();

        this.request.call(data, undefined,
            function (response) {
                done();
                Toast.success("Menu izinleri kaydedildi.");
            }, () => {
                done();
                Toast.error("Kayıt yapılamadı.");
            });
    }

    __resetPermission() {
        if (!this.state.roleId) return;
        this.__readPermissionMenuByRole(this.state.roleId);
        this.__readPermissionServiceByRole(this.state.roleId);
    }

    __readPermissionServiceByRole(roleId) {

        let getPermissionRequest = new AjaxRequest({
            url: "permissions/endPoints/" + roleId,
            type: "GET"
        });

        getPermissionRequest.call(undefined, undefined,
            (res) => {
                this.setState({permissionServices: res});
            });
    }

    __readPermissionMenuByRole(roleId) {

        let getPermissionMenuRequest = new AjaxRequest({
            url: "permissions/menus/" + roleId,
            type: "GET"
        });

        getPermissionMenuRequest.call(undefined, undefined,
            (res) => {
                this.setState({permissionMenus: res});
            });
    }

    __readroleData() {

        let getRoleRequest = new AjaxRequest({
            url: "roles",
            type: "GET"
        });

        getRoleRequest.call(undefined, undefined,
            (res) => {
                this.setState({roleData: res});
            });
    }

    __readPermissionService() {

        let getPermissionRequest = new AjaxRequest({
            url: "permissions/endPoints",
            type: "GET"
        });

        getPermissionRequest.call(undefined, undefined,
            (res) => {
                this.setState({permissionServiceData: res});
            });
    }

    __readPermissionMenu() {

        let getPermissionMenuRequest = new AjaxRequest({
            url: "permissions/menus",
            type: "GET"
        });

        getPermissionMenuRequest.call(undefined, undefined,
            (res) => {
                this.setState({permissionMenuData: res});
            });
    }

    componentDidMount() {
        this.__readroleData();
        this.__readPermissionService();
        this.__readPermissionMenu();
    }
}