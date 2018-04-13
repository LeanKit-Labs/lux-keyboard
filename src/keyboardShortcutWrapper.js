import React from "react";
import { dispatch } from "lux.js";

export default function keyboardShortcutWrapper( Component, { initialScopeToActivate } = {} ) {
	class KeyboardShortcutWrappedComponent extends React.Component {
		constructor( props, context ) {
			super( props, context );

			this.activeScopes = new Set();
			this.activateScope = scope => {
				if ( !this.activeScopes.has( scope ) ) {
					this.activeScopes.add( scope );
					dispatch( "activateScope", scope );
				}
			};
			this.deactivateScope = scope => {
				if ( this.activeScopes.has( scope ) ) {
					this.activeScopes.delete( scope );
					dispatch( "deactivateScope", scope );
				}
			};
		}

		componentDidMount() {
			if ( initialScopeToActivate ) {
				this.activateScope( initialScopeToActivate );
			}
		}

		componentWillUnmount() {
			for ( const scope of this.activeScopes ) {
				this.deactivateScope( scope );
			}
		}

		render() {
			return (
				<Component
					activateScope={ this.activateScope }
					deactivateScope={ this.deactivateScope }
					{ ...this.props } />
			);
		}
	}

	KeyboardShortcutWrappedComponent.displayName = `KeyboardShortcutWrapper(${ Component.displayName || "Component" })`;

	return KeyboardShortcutWrappedComponent;
}
