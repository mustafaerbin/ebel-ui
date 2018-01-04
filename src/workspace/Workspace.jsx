import React from "react";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import SideMenu from "robe-react-ui/lib/sidemenu/SideMenu";
import Col from "react-bootstrap/lib/Col";
import Header from "../header/Header";
import Card from "../card/Card";

export default class Workspace extends ShallowComponent {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            toggled: false
        };
    }


    render() {
        let toggled = this.state.toggled == false ? 0 : 290;
        return (
            <div>
                <Header
                    matches={this.state.matches}
                    toggled={this.state.toggled}
                    onToggle={this.__changeMenu}/>
                <Col
                    id="sideMenu"
                    style={{width: toggled}}
                    className="side-menu">
                    <Card style={{marginLeft: 0}}>
                        <SideMenu
                            items={this.props.route.menu}
                            selectedItem={"Dashboard"}
                            onChange={this.__handleChange}/>
                    </Card>
                </Col>
                <Col
                    id="content"
                    className="content"
                    style={{height: window.innerHeight - 80, marginLeft: toggled}}
                    onClick={this.__closeMenu}>
                    {this.props.children}
                </Col>
            </div>
        );
    }

    __handleChange = (item) => {
        this.context.router.push(item.module);
    };

    __closeMenu = () => {
        if (this.state.matches == true) {
            this.setState({
                toggled: false
            });
        }
    };
    __changeMenu = () => {
        if (this.state.matches == true) {
            this.setState({
                toggled: !this.state.toggled
            });
        }
    };

    __mediaQueryChanged = (mql) => {
        this.setState({
            toggled: !mql.matches,
            matches: mql.matches
        });

    };

    componentWillMount() {
        const mql = window.matchMedia("screen and (max-width: 768px)");
        mql.addListener(this.__mediaQueryChanged);
        this.setState({matches: mql.matches, toggled: !mql.matches});

        this.context.router.listen(this.__closeMenu);

        let initialSelection = window.location.pathname.slice(window.location.pathname.lastIndexOf("/") + 1);
        if (initialSelection) {
            this.context.router.push(initialSelection);
        }
    }

    componentWillUnmount() {
        this.state.mql.removeListener(this.__mediaQueryChanged);
        this.context.router.listen(null);
    }
}
