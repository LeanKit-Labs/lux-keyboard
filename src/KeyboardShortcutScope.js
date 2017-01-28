import React from "react";
import { dispatch } from "lux.js";
import { omit } from "lodash";

export default class KeyboardShortcut extends React.Component {
	componentDidMount() {
		dispatch( "activateScope", this.props.scope );
	}

	componentWillUnmount() {
		dispatch( "deactivateScope", this.props.scope );
	}

	render() {
		return React.createElement(
			this.props.component,
			omit( this.props, [ "scope", "component" ] ),
			this.props.children
		);
	}
}

KeyboardShortcut.displayName = "KeyboardShortcut";

KeyboardShortcut.defaultProps = {
	component: "div"
};

KeyboardShortcut.propTypes = {
	component: React.PropTypes.node,
	scope: React.PropTypes.string.isRequired,
	children: React.PropTypes.node
};
