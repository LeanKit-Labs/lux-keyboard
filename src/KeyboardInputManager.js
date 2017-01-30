/*
	Note - this may not need to remain a react component.
	It could potentially be converted to an object that uses
	the lux store mixin.
*/
import React from "react";
import { luxWrapper, dispatch } from "lux.js";
import keyboardStore from "./keyboardInputStore";
import { each } from "lodash";
import Mousetrap from "./MousetrapWrapper";

function catchThatMouse( handlers ) {
	each( handlers, ( { actionName, includeInputs }, keyBinding ) => {
		const bindOption = includeInputs ? "bindGlobal" : "bind";
		Mousetrap[ bindOption ]( keyBinding, () => dispatch( actionName ) );
	} );
}

export class MouseTrapped extends React.PureComponent {

	componentWillMount() {
		catchThatMouse( this.props.keyMap );
	}

	componentDidUpdate( prevProps, prevState ) {
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
	keyMap: React.PropTypes.object
};

export default luxWrapper( MouseTrapped, {
	stores: [ "keyboard" ],
	getState() {
		return {
			keyMap: keyboardStore.getCurrentKeyMap()
		};
	}
} );
