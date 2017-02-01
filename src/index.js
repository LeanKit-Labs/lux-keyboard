import { dispatch } from "lux.js";
import Mousetrap from "./MousetrapWrapper";

export { default as KeyboardShortcutScope } from "./KeyboardShortcutScope";
export { default as KeyboardInputManager } from "./KeyboardInputManager";
export { default as keyboardShortcutWrapper } from "./keyboardShortcutWrapper";
/*
	Example structure of keyMaps arg:

	{
		"board-quickAdd": {
			isExclusive: false, // optional - only needed if being set to true
			shortcuts: {
				"board-closeQuickAddPanel": {
					keys: [ "esc" ],
					info: "board.shortcuts.closeQuickAdd"
				}
			}
		},
		"board-view": {
			isExclusive: false,
			shortcuts: {
				"board-addCard": {
					keys: [ "a" ],
					info: "board.shortcuts.addCard"
				}
			}
		}
	}
*/
export function loadKeyMap( keyMaps ) {
	dispatch( "receiveKeyMaps", keyMaps );
}

export function unbindAllShortcuts() {
	return Mousetrap.reset();
}

export function disableShortcuts() {
	dispatch( "disableKeyboardShortcuts" );
}

export function enableShortcuts() {
	dispatch( "enableKeyboardShortcuts" );
}
