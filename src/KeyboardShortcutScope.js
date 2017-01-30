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
		const { children } = this.props;

		return React.Children.count( children ) ?
			React.cloneElement( React.Children.only( children ), omit( this.props, [ "scope", "children" ] ) ) :
			null;
	}
}

KeyboardShortcut.displayName = "KeyboardShortcut";

KeyboardShortcut.propTypes = {
	scope: React.PropTypes.string.isRequired,
	children: React.PropTypes.node
};
