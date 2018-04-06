/*
	Note - this may not need to remain a react component.
	It could potentially be converted to an object that uses
	the lux store mixin.
*/
import React from "react";
import PropTypes from "prop-types";
import { luxWrapper, dispatch } from "lux.js";
import keyboardStore from "./keyboardInputStore";
import { each } from "lodash";
import Mousetrap from "./MousetrapWrapper";

function catchThatMouse( handlers ) {
	each( handlers, ( { actionName, includeInputs, preventDefault }, keyBinding ) => {
		const bindOption = includeInputs ? "bindGlobal" : "bind";
		Mousetrap[ bindOption ]( keyBinding, e => {
			// explicitly checking type, since preventDefault is optional + true by default
			if ( preventDefault !== false ) {
				e.preventDefault();
			}
			dispatch( actionName );
		} );
	} );
}

export class MouseTrapped extends React.PureComponent {
	componentWillMount() {
		catchThatMouse( this.props.keyMap );
	}

	componentDidUpdate() {
		Mousetrap.reset();
		catchThatMouse( this.props.keyMap );
	}

	componentWillUnmount() {
		Mousetrap.reset();
	}

	render() {
		return null;
	}
}

MouseTrapped.propTypes = {
	keyMap: PropTypes.object
};

export default luxWrapper( MouseTrapped, {
	stores: [ "keyboard" ],
	getState() {
		return {
			keyMap: keyboardStore.getCurrentKeyMap()
		};
	}
} );
