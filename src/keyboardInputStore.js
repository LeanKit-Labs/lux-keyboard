import { Store } from "lux.js";
import { merge, pick, remove, isEmpty, reduce, isArray } from "lodash";

export default new Store( {
	namespace: "keyboard",
	state: {
		enabled: true,
		scopeStack: [],
		keyMaps: {
			// always active, no matter what
			global: {}
			/*
			leaving this in place until we move this to DialogManager, etc.
				dialog: {
					shortcuts: {
						"mashup-handleRequestToClose": {
							keys: [ "esc" ],
							info: "default.shortcuts.closeDialog"
						}
					}
				}
			*/
		}
	},
	handlers: {
		disableKeyboardShortcuts() {
			this.setState( { enabled: false } );
		},
		enableKeyboardShortcuts() {
			this.setState( { enabled: true } );
		},
		receiveKeyMaps( keyboardInputMaps ) {
			const { keyMaps } = this.getState();
			this.setState( { keyMaps: merge( keyMaps, keyboardInputMaps ) } );
		},
		activateScope( scopeName ) {
			const { scopeStack, keyMaps } = this.getState();
			const scope = keyMaps[ scopeName ];
			// err on the side of assuming scopes are exclusive
			const isExclusive = scope.isExclusive !== false;
			if ( isExclusive || scopeStack.length === 0 ) {
				scopeStack.push( [ scopeName ] );
			} else {
				scopeStack[ scopeStack.length - 1 ].push( scopeName );
			}
			this.setState( { scopeStack } );
		},
		deactivateScope( scopeName ) {
			const { scopeStack } = this.getState();

			for ( let i = scopeStack.length - 1; i >= 0; i-- ) {
				const activeScope = scopeStack[ i ];
				if ( activeScope.includes( scopeName ) ) {
					remove( activeScope, name => name === scopeName );
					if ( isEmpty( activeScope ) ) {
						scopeStack.splice( i, 1 );
					}
					break;
				}
			}

			this.setState( { scopeStack } );
		}
	},
	getCurrentKeyMap() {
		const { scopeStack, keyMaps, enabled } = this.getState();
		if ( !enabled ) {
			return {};
		}
		const activeScopes = scopeStack[ scopeStack.length - 1 ] || [];
		const activeShortcuts = pick( keyMaps, [ "global", ...activeScopes ] );
		// NOTE: we should warn on key binding collision in DEV mode!
		return reduce( activeShortcuts, ( allShortcutsMemo, scope, scopeName ) => {
			const mapForThisScope = reduce( scope.shortcuts, ( thisScopeShortcuts, { keys, includeInputs = true, preventDefault = true }, actionName ) => {
				const keysToBind = isArray( keys ) ? keys : [ keys ];
				keysToBind.forEach( key => {
					thisScopeShortcuts[ key ] = { actionName, includeInputs, preventDefault };
				} );
				return thisScopeShortcuts;
			}, {} );
			return Object.assign( allShortcutsMemo, mapForThisScope );
		}, {} );
	}
} );
