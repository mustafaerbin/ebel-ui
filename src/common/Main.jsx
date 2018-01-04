import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";

class Main extends ShallowComponent {

    render() {
        return (
            this.props.children
        );
    }
}
module.exports = Main;
