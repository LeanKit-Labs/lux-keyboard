import React from "react";
import { dispatch } from "lux.js";

export default class KeyboardShortcutScope extends React.Component {
	componentDidMount() {
		dispatch( "activateScope", this.props.scope );
	}

	componentWillUnmount() {
		dispatch( "deactivateScope", this.props.scope );
	}

	render() {
		const { children } = this.props;

		return React.Children.count( children ) ? React.Children.only( children ) : null;
	}
}

KeyboardShortcutScope.propTypes = {
	scope: React.PropTypes.string.isRequired,
	children: React.PropTypes.node
};
