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
	each( handlers, ( { actionName, notGlobal }, keyBinding ) => {
		const bindOption = notGlobal ? "bind" : "bindGlobal";
		Mousetrap[ bindOption ]( keyBinding, () => dispatch( actionName ) );
	} );
}

export class MouseTrapped extends React.PureComponent {

	componentWillMount() {
		catchThatMouse( this.props.handlers );
	}

	componentDidUpdate( prevProps, prevState ) {
		Mousetrap.reset();
		catchThatMouse( this.props.handlers );
	}

	componentWillUnmount() {
		Mousetrap.reset();
	}

	render() {
		return null;
	}
}

MouseTrapped.displayName = "MouseTrapped";

export default luxWrapper( MouseTrapped, {
	stores: [ "keyboard" ],
	getState() {
		const handlers = keyboardStore.getCurrentKeyMap();
		return {
			handlers
		};
	}
} );
