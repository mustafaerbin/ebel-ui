import React, {Component} from "react";
import {ShallowComponent, Store, RemoteEndPoint, Arrays} from "robe-react-commons";
import TextInput from "robe-react-ui/lib/inputs/TextInput";
import Button from "robe-react-ui/lib/buttons/Button";
import FaIcon from "robe-react-ui/lib/faicon/FaIcon";
import {ListGroup, ListGroupItem, PageHeader, Panel, PanelGroup} from "react-bootstrap";
import Card from "../card/Card";

export default class Application extends ShallowComponent {
    static propTypes = {
        backendUrl: React.PropTypes.string.isRequired
    };
    state = {
        activeKey: "-1",
        parent: "",
        todos: [],
        loading: true,
        text: "",
        description: ""
    };

    parentEndPoint = null;
    subEndPoint = null;

    constructor(props) {
        super(props);
        this.parentEndPoint = new RemoteEndPoint({
            url: "dao-todos"
        });

        this.subEndPoint = new RemoteEndPoint({
            url: "repository-todo-items"
        });
    }

    handleSelect(activeKey) {
        this.setState({
            activeKey
        });
    }

    render() {
        return (
            <Card >
                <PageHeader>Todo App
                    <small> danışmend-quick-start sample app</small>
                </PageHeader>
                <TextInput
                    onKeyPress={ this.__onKeyPressParent }
                    label="Add Your Parent Todo"
                    name="parent"
                    value={ this.state.parent }
                    onChange={ this.__handleChange }/>
                <div className="pull-right">
                    <Button
                        bsStyle="warning"
                        onClickAsync={ this.__onClickParentAsync }>
                        Save Parent
                    </Button>
                </div>
                { this.__renderLoading() }
            </Card>
        )
    }

    __renderLoading() {
        if (this.state.loading) {
            return (
                <div className="text-center">
                    <FaIcon
                        code="fa-spinner fa-spin"
                        size="fa-5x"/>
                </div>);
        }

        return this.__renderPanelGroup();
    }

    __renderPanelGroup() {
        return (
            <PanelGroup
                style={ {marginTop: 60} }
                activeKey={ this.state.activeKey }
                onSelect={ this.handleSelect }
                accordion>
                { this.__renderTodoParents() }
            </PanelGroup>);
    }

    __renderTodoParents() {
        let todos = this.state.todos;
        if (todos.length == 0) {
            let header = <div className="text-center">Your todo list empty</div>;
            return (<Panel header={ header }></Panel>)
        }

        let todosArr = [];
        for (let i = 0; i < todos.length; i++) {
            let todo = todos[i];
            let header = <div>
                { todo.header }
                <div className="pull-right">
                    <Button style={ {marginTop: "-4px"} }
                            onClick={ this.__onDeleteParentButtonClick.bind(undefined, i) }>
                        <FaIcon code="fa-trash" style={ {cursor: "pointer"} }/>
                    </Button>
                </div>
            </div>;

            let index = i + "";
            let panel = (
                <Panel
                    key={ index }
                    header={ header }
                    eventKey={ index }>
                    { this.__renderSubTodoItems(todo, index) }
                </Panel>);
            todosArr.push(panel);
        }

        return todosArr;

    }

    __renderSubTodoItems(todo, index) {

        let todoItems = undefined;

        if (todo.items && todo.items.length > 0) {
            todoItems = todo.items.map((item, i) => <div key={ item.oid } className="col-sm-12"
                                                         style={ {borderBottom: "1px solid #ddd", marginTop: "5px"} }>
                    <div className="col-sm-8">
                        <p>
                            { "Text: " + item.text }
                        </p>
                        <p>
                            { "Description: " + item.description }
                        </p>
                    </div>
                    <div className="col-sm-4">
                        <div className="pull-right">
                            <Button onClick={ this.__onDeleteSubButtonClick.bind(undefined, item, i) }>
                                <FaIcon code="fa-trash" style={ {cursor: "pointer"} }/>
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }
        return (<div className="row">
            { todoItems }
            { this.__renderAddTodoItem(index) }
        </div>);
    }

    __onKeyPressParent(e) {
        if (e.key == "Enter")
            this.__onClickParentAsync(e, () => {
            });
    }

    __onKeyPressSub(e) {
        if (e.key == "Enter")
            this.__onClickSubAsync(e, () => {
            });
    }

    __onDeleteParentButtonClick(index, e, other) {
        e.stopPropagation();

        let c = confirm("Are you sure for delete ");

        if (c) {
            let todo = this.state.todos[index];
            this.parentEndPoint.delete(todo, "oid", (res) => {
                let todos = this.state.todos;
                if (Arrays.remove(todos, todo)) {
                    this.setState({
                        todos,
                    });
                    this.forceUpdate();
                }
            }, (err) => {
                console.log(err);
            });
        }

    }

    __onDeleteSubButtonClick(todoItem, index, e, other) {
        e.stopPropagation();

        let c = confirm("Are you sure for delete ");

        if (c) {

            this.subEndPoint.delete(todoItem, "oid", (res) => {

                let todos = this.state.todos;
                let todo = todos[this.state.activeKey];
                let items = todo.items;
                if (Arrays.remove(items, todoItem)) {
                    this.setState({
                        todos,
                    });
                    this.forceUpdate();
                }
            }, (err) => {
                console.log(err);
            });
        }

    }

    __renderAddTodoItem(key) {
        if (key == this.state.activeKey)
            return ( <div className="col-sm-12">
                <Panel header="Add New Sub Item">
                    <TextInput label="Sub todo text" name="text" value={ this.state.text }
                               onChange={ this.__handleChange }/>
                    <TextInput label="Sub todo description" name="description" value={ this.state.description }
                               onChange={ this.__handleChange }/>
                    <div className="pull-right">
                        <Button bsStyle="warning" onClickAsync={ this.__onClickSubAsync }>
                            Save Sub
                        </Button>
                    </div>
                </Panel>
            </div>);
        return null;
    }

    __onClickParentAsync(e, done) {

        let todo = {
            header: this.state.parent
        };

        if (!todo.header) {
            return;
        }
        this.parentEndPoint.create(todo, (res) => {
            let todos = this.state.todos;
            todos.push(res.data);
            this.setState({
                todos,
                parent: ""
            });
            done();
        }, (err) => {
            console.log(err);
            done();
        });
    }

    __onClickSubAsync(e, done) {

        let todo = this.state.todos[this.state.activeKey];

        let todoItem = {
            text: this.state.text,
            description: this.state.description,
            parent: todo
        };
        this.subEndPoint.create(todoItem, (res) => {
            let todos = this.state.todos;
            todo = todos[this.state.activeKey];

            if (!todo.items) {
                todo.items = [];
            }
            todo.items.push(res.data);

            this.setState({
                todos,
                parent: "",
                text: "",
                description: ""
            });
            done();
        }, (err) => {
            console.log(err);
            done();
        });
    }

    __handleChange(e) {
        let state = {};
        let value = e.target.parsedValue !== undefined ? e.target.parsedValue : e.target.value;
        state[e.target.name] = value;
        this.setState(state);
    }

    componentDidMount() {
        this.parentEndPoint.read(undefined, (res) => {
            this.setState({
                todos: res.data,
                loading: false
            });
        }, () => {
        });
    }
}