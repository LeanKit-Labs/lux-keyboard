/**
	Adapted this from:
	https://github.com/ccampbell/mousetrap/blob/master/plugins/global-bind/mousetrap-global-bind.js

	adds a bindGlobal method to Mousetrap that allows you to bind specific
	keyboard shortcuts that will still work inside a text input field

	usage:
	Mousetrap.bindGlobal('ctrl+s', _saveChanges);
 */

import Mousetrap from "mousetrap";

export default ( function( _Mousetrap ) {
	const _globalCallbacks = {};
	const _originalStopCallback = _Mousetrap.prototype.stopCallback;

	_Mousetrap.prototype.stopCallback = function( e, element, combo, sequence ) {
		const self = this;

		if ( self.paused ) {
			return true;
		}

		if ( _globalCallbacks[ combo ] || _globalCallbacks[ sequence ] ) {
			return false;
		}

		return _originalStopCallback.call( self, e, element, combo );
	};

	_Mousetrap.prototype.bindGlobal = function( keys, callback, action ) {
		const self = this;
		self.bind( keys, callback, action );

		if ( keys instanceof Array ) {
			let i;
			for ( i = 0; i < keys.length; i++ ) {
				_globalCallbacks[ keys[ i ] ] = true;
			}
			return;
		}

		_globalCallbacks[ keys ] = true;
	};

	_Mousetrap.init();

	return _Mousetrap;
}( Mousetrap ) );
