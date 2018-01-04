import React from "react";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import AjaxRequest from "robe-react-commons/lib/connections/AjaxRequest";
import Router from "react-router/lib/Router";
import hashHistory from "react-router/lib/hashHistory";
import Workspace from "../workspace/Workspace";
import NotFound from "../common/NotFound";
import loader from "./loader";

export default class HasAuthorization extends ShallowComponent {

    menuRequest = new AjaxRequest({
        url: "menus",
        type: "GET"
    });

    static ROUTES = [];
    static ROUTER;

    constructor(props) {
        super(props);
        this.state = {
            menus: undefined
        };
    }

    render() {
        if (!this.state.menus) {
            return (<span/>);
        }
        HasAuthorization.ROUTER = HasAuthorization.createRoutes(this.state.menus);

        return (<Router key="root"
                        history={hashHistory}
                        onUpdate={HasAuthorization.scrollTop}
                        routes={HasAuthorization.ROUTER}/>);
    }

    static createRoutes(menu) {


        HasAuthorization.importMenu(menu);
        // HasAuthorization.ROUTES.push(NOT_FOUND_ROUTE);

        return ({
            menu: menu,
            path: "/",
            component: Workspace,
            indexRoute: NotFound,
            childRoutes: HasAuthorization.ROUTES
        });
    }

    static importMenu(items) {
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (item.items && item.items.length > 0) {
                HasAuthorization.importMenu(item.items);
            } else {
                const path = HasAuthorization.normalizePath(item.path);

                let obj = {
                    path: item.module,
                    getComponent(location, cb) {
                        loader(path, cb);
                    }
                };
                HasAuthorization.ROUTES.push(obj);
            }
        }
    }


    /**
     * this function changing absolute path to relative path
     */
    static normalizePath(path) {
        if (path && !path.startsWith("../")) {
            return "" + path;
        }
        return path;
    }

    static scrollTop() {
        window.scrollTo(0, 0);
    }

    componentDidMount() {
        this.menuRequest.call(undefined, undefined,
            (res) => {
                this.setState({menus: res})
            });

    }

}
